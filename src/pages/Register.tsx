import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole, ROLE_CONFIGS, REGISTRATION_ROLES } from "@/lib/roles";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import logo from "@/assets/logo.png";
import { ChevronRight, ChevronLeft, Upload } from "lucide-react";

export default function Register() {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<UserRole | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [location, setLocation] = useState("");
  const [dob, setDob] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const isBeneficiary = role === "beneficiary";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) return;
    setLoading(true);
    try {
      await register({ name, email, password, role, phone, idNumber, location, dateOfBirth: dob });
      navigate("/pending-approval");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-md space-y-6 animate-fade-in">
        <div className="text-center">
          <img src={logo} alt="KPAO" className="w-16 h-16 mx-auto mb-3 object-contain" />
          <h1 className="text-2xl font-bold font-heading">Create Account</h1>
          <p className="text-sm text-muted-foreground mt-1">Step {step} of {isBeneficiary && step === 2 ? 3 : 2}</p>
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <p className="text-sm font-medium">Select your role:</p>
            <div className="grid grid-cols-2 gap-3">
              {REGISTRATION_ROLES.map((r) => (
                <button key={r} onClick={() => setRole(r)}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    role === r ? "border-primary bg-primary/5 ring-2 ring-primary/20" : "hover:bg-muted"
                  }`}>
                  <p className="text-sm font-medium">{ROLE_CONFIGS[r].label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{ROLE_CONFIGS[r].description}</p>
                </button>
              ))}
            </div>
            <Button onClick={() => role && setStep(2)} disabled={!role} className="w-full">
              Continue <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        )}

        {step === 2 && (
          <form onSubmit={isBeneficiary ? (e) => { e.preventDefault(); setStep(3); } : handleSubmit} className="space-y-4">
            <div>
              <Label>Full Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" required />
            </div>
            <div>
              <Label>Email</Label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
            </div>
            <div>
              <Label>Password</Label>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
            </div>
            <div>
              <Label>Phone Number</Label>
              <Input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+254..." />
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => setStep(1)} className="flex-1">
                <ChevronLeft className="mr-1 h-4 w-4" /> Back
              </Button>
              <Button type="submit" className="flex-1" disabled={loading}>
                {isBeneficiary ? "Next" : loading ? "Creating..." : "Create Account"}
                {isBeneficiary && <ChevronRight className="ml-1 h-4 w-4" />}
              </Button>
            </div>
          </form>
        )}

        {step === 3 && isBeneficiary && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-sm text-muted-foreground">Additional information required for beneficiaries</p>
            <div>
              <Label>National ID Number</Label>
              <Input value={idNumber} onChange={(e) => setIdNumber(e.target.value)} placeholder="ID Number" required />
            </div>
            <div>
              <Label>Location</Label>
              <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Nairobi, Mombasa" required />
            </div>
            <div>
              <Label>Date of Birth</Label>
              <Input type="date" value={dob} onChange={(e) => setDob(e.target.value)} required />
            </div>
            <div>
              <Label>Photo (for verification)</Label>
              <div className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors">
                <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">Tap to upload photo</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => setStep(2)} className="flex-1">
                <ChevronLeft className="mr-1 h-4 w-4" /> Back
              </Button>
              <Button type="submit" className="flex-1" disabled={loading}>
                {loading ? "Creating..." : "Create Account"}
              </Button>
            </div>
          </form>
        )}

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="text-primary font-medium hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
