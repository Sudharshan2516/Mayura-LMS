import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  BookOpen,
  Trophy,
  Target,
  TrendingUp,
  LogOut,
  Sparkles,
  Award,
  Calendar
} from "lucide-react";
import { toast } from "sonner";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      navigate("/auth");
      return;
    }

    setUser(user);

    // Fetch profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();

    setProfile(profile);
    setLoading(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out successfully");
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-primary">Loading...</div>
      </div>
    );
  }

  const stats = [
    { icon: BookOpen, label: "Active Courses", value: "0", color: "from-blue-400 to-cyan-400" },
    { icon: Trophy, label: "XP Points", value: profile?.xp || 0, color: "from-purple-400 to-pink-400" },
    { icon: Target, label: "Streak Days", value: profile?.streak || 0, color: "from-orange-400 to-red-400" },
    { icon: TrendingUp, label: "Completion", value: "0%", color: "from-green-400 to-emerald-400" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary animate-pulse" />
            <span className="font-heading text-xl font-bold">Dashboard</span>
          </div>
          <Button variant="ghost" onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card className="p-8 bg-gradient-dawn border-0 shadow-glow">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-gradient-wisdom flex items-center justify-center shadow-soft">
                <Award className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="font-heading text-3xl mb-1">
                  Welcome back, {profile?.name || "Learner"}!
                </h1>
                <p className="text-muted-foreground">
                  Ready to continue your learning journey?
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 hover:shadow-soft transition-all">
                <div className="flex items-center gap-4">
                  <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Course Section */}
        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading text-2xl">My Courses</h2>
              <Button variant="outline" size="sm">View All</Button>
            </div>
            <div className="text-center py-12 text-muted-foreground">
              <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No courses enrolled yet</p>
              <Button className="mt-4 bg-gradient-wisdom" onClick={() => navigate("/courses")}>
                Explore Courses
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading text-2xl">Upcoming Events</h2>
              <Button variant="outline" size="sm">View All</Button>
            </div>
            <div className="text-center py-12 text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No upcoming events</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;