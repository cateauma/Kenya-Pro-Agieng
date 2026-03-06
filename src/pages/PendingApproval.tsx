import { Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";

export default function PendingApproval() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm text-center space-y-6 animate-fade-in">
        <img src={logo} alt="KPAO" className="w-16 h-16 mx-auto object-contain" />
        <div className="w-16 h-16 rounded-full bg-warning/10 flex items-center justify-center mx-auto">
          <Clock className="h-8 w-8 text-warning" />
        </div>
        <h1 className="text-2xl font-bold font-heading">Pending Approval</h1>
        <p className="text-sm text-muted-foreground">
          Your account has been created and is awaiting admin approval. You'll receive a notification once your account is approved.
        </p>
        <Button variant="outline" asChild>
          <Link to="/login">Back to Login</Link>
        </Button>
      </div>
    </div>
  );
}
