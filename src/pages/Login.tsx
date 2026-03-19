import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ROLE_CONFIGS } from "@/lib/roles";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import logo from "@/assets/logo.png";
import { Eye, EyeOff, AlertCircle } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login, setMockUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await login(email, password);
      if (user.status === "pending") {
        navigate("/pending-approval");
        return;
      }
      const path = ROLE_CONFIGS[user.role as keyof typeof ROLE_CONFIGS].dashboardPath;
      navigate(path);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (role: keyof typeof ROLE_CONFIGS) => {
    setMockUser(role);
    navigate(ROLE_CONFIGS[role].dashboardPath);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-6 animate-fade-in">
        <div className="text-center">
          <img src={logo} alt="KPAO" className="w-20 h-20 mx-auto mb-4 object-contain" />
          <h1 className="text-2xl font-bold font-heading">Welcome Back</h1>
          <p className="text-sm text-muted-foreground mt-1">Sign in to Kenya Pro Aging Organization</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input id="password" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link to="/register" className="text-primary font-medium hover:underline">Register</Link>
        </p>

        <div className="border-t pt-4">
          <p className="text-xs text-muted-foreground text-center mb-3"></p>
          <div className="grid grid-cols-3 gap-2">
            {Object.entries(ROLE_CONFIGS).map(([key, config]) => (
              <button
                key={key}
                onClick={() => handleDemoLogin(key as keyof typeof ROLE_CONFIGS)}
                className="text-xs py-2 px-2 rounded-md bg-muted hover:bg-muted/80 text-muted-foreground transition-colors truncate"
              >
                {config.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}