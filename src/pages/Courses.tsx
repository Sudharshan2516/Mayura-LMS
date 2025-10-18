import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Search, BookOpen, Clock, Users, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const Courses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    checkAuth();
    fetchCourses();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/auth");
    }
  };

  const fetchCourses = async () => {
    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to load courses");
    } else {
      setCourses(data || []);
    }
    setLoading(false);
  };

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="font-heading text-2xl font-bold">Explore Courses</h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 text-lg"
            />
          </div>
        </motion.div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-pulse text-primary">Loading courses...</div>
          </div>
        ) : filteredCourses.length === 0 ? (
          <Card className="p-12 text-center">
            <BookOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h2 className="font-heading text-2xl mb-2">No courses available yet</h2>
            <p className="text-muted-foreground mb-6">
              Be the first to create a course and start teaching!
            </p>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Card className="overflow-hidden hover:shadow-soft transition-all cursor-pointer">
                  <div className="h-48 bg-gradient-dawn flex items-center justify-center">
                    {course.thumbnail ? (
                      <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                    ) : (
                      <BookOpen className="h-16 w-16 text-primary opacity-50" />
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="font-heading text-xl mb-2">{course.title}</h3>
                    <p className="text-muted-foreground mb-4 line-clamp-2">
                      {course.description || "No description available"}
                    </p>
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>8 weeks</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>0 enrolled</span>
                      </div>
                    </div>
                    <Button className="w-full bg-gradient-wisdom">
                      Enroll Now
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;