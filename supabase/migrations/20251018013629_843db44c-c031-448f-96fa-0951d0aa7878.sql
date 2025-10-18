-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create app_role enum for user roles
CREATE TYPE public.app_role AS ENUM ('student', 'teacher', 'admin');

-- Create tenants table
CREATE TABLE public.tenants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create profiles table (extends auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  avatar_url TEXT,
  xp INTEGER DEFAULT 0,
  streak INTEGER DEFAULT 0,
  last_active TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create user_roles table for role management
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE NOT NULL,
  UNIQUE(user_id, role, tenant_id)
);

-- Create courses table
CREATE TABLE public.courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  thumbnail TEXT,
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create enrollments table
CREATE TABLE public.enrollments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE NOT NULL,
  progress INTEGER DEFAULT 0,
  enrolled_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(course_id, user_id)
);

-- Create assignments table
CREATE TABLE public.assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  due_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create submissions table
CREATE TABLE public.submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  assignment_id UUID REFERENCES public.assignments(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE NOT NULL,
  file_url TEXT,
  grade INTEGER,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create badges table
CREATE TABLE public.badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create user_badges table
CREATE TABLE public.user_badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  badge_id UUID REFERENCES public.badges(id) ON DELETE CASCADE NOT NULL,
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE NOT NULL,
  earned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, badge_id)
);

-- Create events table
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  event_date TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Create security definer function to get user's tenant_id
CREATE OR REPLACE FUNCTION public.get_user_tenant_id()
RETURNS UUID
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT tenant_id FROM public.profiles WHERE user_id = auth.uid();
$$;

-- Create security definer function to check user role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  );
$$;

-- RLS Policies for profiles
CREATE POLICY "Users can view profiles in their tenant"
  ON public.profiles FOR SELECT
  USING (tenant_id = public.get_user_tenant_id());

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (user_id = auth.uid());

-- RLS Policies for courses
CREATE POLICY "Users can view courses in their tenant"
  ON public.courses FOR SELECT
  USING (tenant_id = public.get_user_tenant_id());

CREATE POLICY "Teachers can create courses"
  ON public.courses FOR INSERT
  WITH CHECK (
    tenant_id = public.get_user_tenant_id() AND
    public.has_role(auth.uid(), 'teacher')
  );

CREATE POLICY "Teachers can update their courses"
  ON public.courses FOR UPDATE
  USING (
    tenant_id = public.get_user_tenant_id() AND
    created_by = auth.uid()
  );

-- RLS Policies for enrollments
CREATE POLICY "Users can view their enrollments"
  ON public.enrollments FOR SELECT
  USING (
    tenant_id = public.get_user_tenant_id() AND
    user_id = auth.uid()
  );

CREATE POLICY "Students can enroll in courses"
  ON public.enrollments FOR INSERT
  WITH CHECK (
    tenant_id = public.get_user_tenant_id() AND
    user_id = auth.uid()
  );

-- RLS Policies for assignments
CREATE POLICY "Users can view assignments in their tenant"
  ON public.assignments FOR SELECT
  USING (tenant_id = public.get_user_tenant_id());

CREATE POLICY "Teachers can create assignments"
  ON public.assignments FOR INSERT
  WITH CHECK (
    tenant_id = public.get_user_tenant_id() AND
    public.has_role(auth.uid(), 'teacher')
  );

-- RLS Policies for submissions
CREATE POLICY "Users can view their own submissions"
  ON public.submissions FOR SELECT
  USING (
    tenant_id = public.get_user_tenant_id() AND
    user_id = auth.uid()
  );

CREATE POLICY "Teachers can view all submissions"
  ON public.submissions FOR SELECT
  USING (
    tenant_id = public.get_user_tenant_id() AND
    public.has_role(auth.uid(), 'teacher')
  );

CREATE POLICY "Students can create submissions"
  ON public.submissions FOR INSERT
  WITH CHECK (
    tenant_id = public.get_user_tenant_id() AND
    user_id = auth.uid()
  );

-- RLS Policies for badges
CREATE POLICY "Users can view badges in their tenant"
  ON public.badges FOR SELECT
  USING (tenant_id = public.get_user_tenant_id());

-- RLS Policies for user_badges
CREATE POLICY "Users can view their badges"
  ON public.user_badges FOR SELECT
  USING (
    tenant_id = public.get_user_tenant_id() AND
    user_id = auth.uid()
  );

-- RLS Policies for events
CREATE POLICY "Users can view events in their tenant"
  ON public.events FOR SELECT
  USING (tenant_id = public.get_user_tenant_id());

-- Create storage bucket for LMS files
INSERT INTO storage.buckets (id, name, public) VALUES ('lms-files', 'lms-files', false);

-- Storage policies for course materials
CREATE POLICY "Users can view files in their tenant"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'lms-files');

CREATE POLICY "Teachers can upload files"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'lms-files' AND
    public.has_role(auth.uid(), 'teacher')
  );

-- Create trigger function to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE PLPGSQL
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  default_tenant_id UUID;
BEGIN
  -- Get or create default tenant
  SELECT id INTO default_tenant_id FROM public.tenants WHERE slug = 'default' LIMIT 1;
  
  IF default_tenant_id IS NULL THEN
    INSERT INTO public.tenants (name, slug) VALUES ('Default Tenant', 'default') RETURNING id INTO default_tenant_id;
  END IF;

  -- Create profile
  INSERT INTO public.profiles (user_id, tenant_id, name)
  VALUES (
    NEW.id,
    default_tenant_id,
    COALESCE(NEW.raw_user_meta_data->>'name', 'New User')
  );

  -- Assign default student role
  INSERT INTO public.user_roles (user_id, role, tenant_id)
  VALUES (NEW.id, 'student', default_tenant_id);

  RETURN NEW;
END;
$$;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();