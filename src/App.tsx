import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PendingApproval from "./pages/PendingApproval";
import AdminDashboard from "./pages/dashboards/AdminDashboard";
import ProgramManagerDashboard from "./pages/dashboards/ProgramManagerDashboard";
import SocialWorkerDashboard from "./pages/dashboards/SocialWorkerDashboard";
import HealthcareDashboard from "./pages/dashboards/HealthcareDashboard";
import FinanceDashboard from "./pages/dashboards/FinanceDashboard";
import DonorDashboard from "./pages/dashboards/DonorDashboard";
import BeneficiaryDashboard from "./pages/dashboards/BeneficiaryDashboard";
import CaregiverDashboard from "./pages/dashboards/CaregiverDashboard";
import VolunteerDashboard from "./pages/dashboards/VolunteerDashboard";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Help from "./pages/Help";
import Feedback from "./pages/Feedback";
import SearchPage from "./pages/SearchPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/pending-approval" element={<PendingApproval />} />
            
            {/* Role dashboards */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/*" element={<AdminDashboard />} />
            <Route path="/program-manager" element={<ProgramManagerDashboard />} />
            <Route path="/program-manager/*" element={<ProgramManagerDashboard />} />
            <Route path="/social-worker" element={<SocialWorkerDashboard />} />
            <Route path="/social-worker/*" element={<SocialWorkerDashboard />} />
            <Route path="/healthcare" element={<HealthcareDashboard />} />
            <Route path="/healthcare/*" element={<HealthcareDashboard />} />
            <Route path="/finance" element={<FinanceDashboard />} />
            <Route path="/finance/*" element={<FinanceDashboard />} />
            <Route path="/donor" element={<DonorDashboard />} />
            <Route path="/donor/*" element={<DonorDashboard />} />
            <Route path="/beneficiary" element={<BeneficiaryDashboard />} />
            <Route path="/beneficiary/*" element={<BeneficiaryDashboard />} />
            <Route path="/caregiver" element={<CaregiverDashboard />} />
            <Route path="/caregiver/*" element={<CaregiverDashboard />} />
            <Route path="/volunteer" element={<VolunteerDashboard />} />
            <Route path="/volunteer/*" element={<VolunteerDashboard />} />

            {/* Static pages */}
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/help" element={<Help />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/search" element={<SearchPage />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
