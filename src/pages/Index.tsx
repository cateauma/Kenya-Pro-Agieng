import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ROLE_CONFIGS } from "@/lib/roles";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";
import { ArrowRight, Heart, Users, Shield } from "lucide-react";

export default function Index() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const handleGetStarted = () => {
    if (isAuthenticated && user) {
      navigate(ROLE_CONFIGS[user.role].dashboardPath);
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="flex items-center justify-between px-4 py-4 max-w-5xl mx-auto">
        <div className="flex items-center gap-3">
          <img src={logo} alt="KPAO" className="w-10 h-10 object-contain" />
          <span className="font-heading font-bold text-lg">KPAO</span>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" onClick={() => navigate("/login")}>Sign In</Button>
          <Button onClick={() => navigate("/register")}>Register</Button>
        </div>
      </header>

      <main className="px-4 pt-12 pb-20 max-w-5xl mx-auto">
        <div className="text-center space-y-6 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold font-heading leading-tight">
            Dignified Care for
            <span className="text-primary"> Kenya's Elders</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Connecting elderly beneficiaries with meals, healthcare, counseling, and community support through a centralized digital platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button size="lg" onClick={handleGetStarted}>
              Get Started <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/about")}>
              Learn More
            </Button>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-3 mt-20">
          {[
            { icon: Heart, title: "Care Services", desc: "Meals, clothing, health monitoring, and counseling for beneficiaries." },
            { icon: Users, title: "Community", desc: "Volunteers, donors, and caregivers working together for impact." },
            { icon: Shield, title: "Secure & Trusted", desc: "Role-based access with admin oversight and approval workflows." },
          ].map((item) => (
            <div key={item.title} className="stat-card text-center animate-fade-in">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <item.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-heading font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </main>

      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
        © 2026 KeMU. All rights reserved.
      </footer>
    </div>
  );
}
