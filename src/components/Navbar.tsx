import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { GraduationCap, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export const Navbar = () => {
  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b"
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="relative">
            <GraduationCap className="h-8 w-8 text-primary transition-transform group-hover:scale-110" />
            <Sparkles className="h-4 w-4 text-accent absolute -top-1 -right-1 animate-pulse" />
          </div>
          <span className="font-heading text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Mayura LMS
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link to="/about" className="text-foreground/80 hover:text-primary transition-colors">
            About
          </Link>
          <Link to="/features" className="text-foreground/80 hover:text-primary transition-colors">
            Features
          </Link>
          <Link to="/pricing" className="text-foreground/80 hover:text-primary transition-colors">
            Pricing
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/auth">
            <Button variant="ghost">Sign In</Button>
          </Link>
          <Link to="/auth">
            <Button className="bg-gradient-wisdom shadow-soft">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </motion.nav>
  );
};