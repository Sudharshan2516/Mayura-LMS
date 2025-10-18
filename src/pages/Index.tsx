import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { 
  BookOpen, 
  Brain, 
  Trophy, 
  Users, 
  Sparkles, 
  Zap,
  Target,
  TrendingUp
} from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-learning.jpg";

const Index = () => {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Learning",
      description: "Intelligent flashcards, quizzes, and personalized study plans powered by Gemini AI",
      gradient: "from-purple-400 to-pink-400"
    },
    {
      icon: Trophy,
      title: "Gamified Experience",
      description: "Earn XP, badges, and climb leaderboards while staying motivated with streak tracking",
      gradient: "from-blue-400 to-cyan-400"
    },
    {
      icon: Users,
      title: "Collaborative Learning",
      description: "Join study groups, participate in discussions, and learn together with peers",
      gradient: "from-green-400 to-emerald-400"
    },
    {
      icon: Target,
      title: "Smart Analytics",
      description: "Track your progress with detailed insights and AI-generated recommendations",
      gradient: "from-orange-400 to-red-400"
    }
  ];

  const stats = [
    { label: "Active Learners", value: "10,000+", icon: Users },
    { label: "Courses Available", value: "500+", icon: BookOpen },
    { label: "Success Rate", value: "95%", icon: TrendingUp },
    { label: "AI Interactions", value: "1M+", icon: Sparkles }
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 mb-6">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">AI-Powered Learning Platform</span>
              </div>
              
              <h1 className="font-heading text-5xl lg:text-7xl mb-6 leading-tight">
                Where Learning Becomes a{" "}
                <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-pulse">
                  Living Experience
                </span>
              </h1>
              
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Mayura LMS combines cutting-edge AI, gamification, and collaborative tools 
                to transform how you learn. Experience personalized education that adapts to your journey.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Link to="/auth">
                  <Button size="lg" className="bg-gradient-wisdom shadow-soft text-lg px-8">
                    <Zap className="mr-2 h-5 w-5" />
                    Start Learning Free
                  </Button>
                </Link>
                <Link to="/features">
                  <Button size="lg" variant="outline" className="text-lg px-8">
                    Explore Features
                  </Button>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-glow">
                <img src={heroImage} alt="Mayura LMS Learning" className="w-full h-auto rounded-3xl" />
                <Card className="absolute bottom-4 left-4 right-4 p-8 backdrop-blur-md bg-card/90 border-2">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-full bg-gradient-wisdom flex items-center justify-center">
                          <Brain className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <div className="font-semibold">AI Study Assistant</div>
                          <div className="text-sm text-muted-foreground">Active Now</div>
                        </div>
                      </div>
                      <Sparkles className="h-6 w-6 text-primary animate-glow" />
                    </div>
                    
                    <div className="space-y-3">
                      {[1, 2, 3].map((i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.4 + i * 0.2 }}
                          className="p-4 rounded-xl bg-secondary/50 animate-float"
                          style={{ animationDelay: `${i * 0.5}s` }}
                        >
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center">
                              <BookOpen className="h-4 w-4 text-primary" />
                            </div>
                            <div className="flex-1">
                              <div className="h-2 bg-primary/30 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-gradient-wisdom"
                                  style={{ width: `${30 + i * 20}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </Card>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-secondary/30">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="p-6 text-center hover:shadow-soft transition-shadow">
                  <stat.icon className="h-8 w-8 mx-auto mb-3 text-primary" />
                  <div className="text-3xl font-bold mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-heading text-4xl lg:text-5xl mb-4">
              Everything You Need to Excel
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed to make learning engaging, effective, and enjoyable
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <Card className="p-6 h-full hover:shadow-soft transition-all">
                  <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4`}>
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-heading text-xl mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <Card className="p-12 text-center bg-gradient-dawn border-0 shadow-glow">
              <Sparkles className="h-12 w-12 mx-auto mb-4 text-primary animate-glow" />
              <h2 className="font-heading text-4xl mb-4">
                Ready to Transform Your Learning?
              </h2>
              <p className="text-xl text-foreground/80 mb-8 max-w-2xl mx-auto">
                Join thousands of learners who are already experiencing the future of education
              </p>
              <Link to="/auth">
                <Button size="lg" className="bg-gradient-wisdom shadow-soft text-lg px-8">
                  Get Started Now - It's Free
                </Button>
              </Link>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>© 2025 Mayura LMS. Where Learning Becomes a Living Experience.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;