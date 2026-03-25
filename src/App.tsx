import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";

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

// Admin sub-pages
import UserManagement from "./pages/admin/UserManagement";
import Approvals from "./pages/admin/Approvals";
import Signups from "./pages/admin/Signups";
import ServiceRequests from "./pages/admin/ServiceRequests";
import Reports from "./pages/admin/Reports";
import AdminSettings from "./pages/admin/AdminSettings";

// Program Manager sub-pages
import Programs from "./pages/program-manager/Programs";
import Assignments from "./pages/program-manager/Assignments";
import PMReports from "./pages/program-manager/PMReports";

// Social Worker sub-pages
import Cases from "./pages/social-worker/Cases";
import HomeVisits from "./pages/social-worker/HomeVisits";
import Counseling from "./pages/social-worker/Counseling";

// Healthcare sub-pages
import HealthRecords from "./pages/healthcare/HealthRecords";
import Appointments from "./pages/healthcare/Appointments";

// Finance sub-pages
import Donations from "./pages/finance/Donations";
import Budget from "./pages/finance/Budget";
import FinanceReports from "./pages/finance/FinanceReports";

// Donor sub-pages
import MyDonations from "./pages/donor/MyDonations";
import ImpactReports from "./pages/donor/ImpactReports";

// Beneficiary sub-pages
import Services from "./pages/beneficiary/Services";
import BeneficiaryNotifications from "./pages/beneficiary/Notifications";

// Caregiver sub-pages
import CaregiverSchedule from "./pages/caregiver/Schedule";
import BeneficiaryList from "./pages/caregiver/BeneficiaryList";
import CaregiverLogs from "./pages/caregiver/CaregiverLogs";

// Volunteer sub-pages
import Opportunities from "./pages/volunteer/Opportunities";
import MyHours from "./pages/volunteer/MyHours";
import Events from "./pages/volunteer/Events";

const queryClient = new QueryClient();

const App = () => {
  // --- PWA install button state ---
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallButton, setShowInstallButton] = useState(false);

  // --- Check if on mobile device ---
  const isMobile = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  };

  // --- PWA beforeinstallprompt handler ---
  useEffect(() => {
    const handler = (e: Event) => {
      // Prevent automatic prompt so we can show button
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallButton(true);
      console.log("Install prompt ready on mobile");
    };

    window.addEventListener("beforeinstallprompt", handler);

    // If on mobile but event hasn't fired after 3 seconds, still show the button
    // with a fallback to manual add to home screen instructions
    if (isMobile()) {
      const timer = setTimeout(() => {
        if (!showInstallButton && !deferredPrompt) {
          setShowInstallButton(true);
          setDeferredPrompt(null); // No auto prompt available, will show manual instructions
        }
      }, 3000);
      
      return () => {
        clearTimeout(timer);
        window.removeEventListener("beforeinstallprompt", handler);
      };
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstallClick = () => {
    if (!deferredPrompt) {
      // If no deferred prompt, show manual instructions
      alert("To install the app:\n\nAndroid: Tap the three dots menu → 'Install App' or 'Add to Home Screen'\n\niPhone: Tap Share button → 'Add to Home Screen'");
      return;
    }
    
    // Show the install prompt
    deferredPrompt.prompt();
    
    // Wait for user response
    deferredPrompt.userChoice.then((choiceResult: any) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted install');
      }
      setDeferredPrompt(null);
      setShowInstallButton(false);
    });
  };

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          
          {/* Install Button - Only show on mobile */}
          {showInstallButton && (
            <button
              onClick={handleInstallClick}
              style={{
                position: 'fixed',
                bottom: '20px',
                right: '20px',
                backgroundColor: '#3b82f6',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '50px',
                border: 'none',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                zIndex: 9999,
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '16px',
                fontFamily: 'system-ui, -apple-system, sans-serif'
              }}
            >
              📱 Install App
            </button>
          )}
          
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/pending-approval" element={<PendingApproval />} />

              {/* Admin */}
              <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
              <Route path="/admin/users" element={<ProtectedRoute><UserManagement /></ProtectedRoute>} />
              <Route path="/admin/approvals" element={<ProtectedRoute><Approvals /></ProtectedRoute>} />
              <Route path="/admin/signups" element={<ProtectedRoute><Signups /></ProtectedRoute>} />
              <Route path="/admin/service-requests" element={<ProtectedRoute><ServiceRequests /></ProtectedRoute>} />
              <Route path="/admin/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
              <Route path="/admin/settings" element={<ProtectedRoute><AdminSettings /></ProtectedRoute>} />

              {/* Program Manager */}
              <Route path="/program-manager" element={<ProtectedRoute><ProgramManagerDashboard /></ProtectedRoute>} />
              <Route path="/program-manager/programs" element={<ProtectedRoute><Programs /></ProtectedRoute>} />
              <Route path="/program-manager/assignments" element={<ProtectedRoute><Assignments /></ProtectedRoute>} />
              <Route path="/program-manager/reports" element={<ProtectedRoute><PMReports /></ProtectedRoute>} />

              {/* Social Worker */}
              <Route path="/social-worker" element={<ProtectedRoute><SocialWorkerDashboard /></ProtectedRoute>} />
              <Route path="/social-worker/cases" element={<ProtectedRoute><Cases /></ProtectedRoute>} />
              <Route path="/social-worker/visits" element={<ProtectedRoute><HomeVisits /></ProtectedRoute>} />
              <Route path="/social-worker/counseling" element={<ProtectedRoute><Counseling /></ProtectedRoute>} />

              {/* Healthcare */}
              <Route path="/healthcare" element={<ProtectedRoute><HealthcareDashboard /></ProtectedRoute>} />
              <Route path="/healthcare/records" element={<ProtectedRoute><HealthRecords /></ProtectedRoute>} />
              <Route path="/healthcare/appointments" element={<ProtectedRoute><Appointments /></ProtectedRoute>} />

              {/* Finance */}
              <Route path="/finance" element={<ProtectedRoute><FinanceDashboard /></ProtectedRoute>} />
              <Route path="/finance/donations" element={<ProtectedRoute><Donations /></ProtectedRoute>} />
              <Route path="/finance/budget" element={<ProtectedRoute><Budget /></ProtectedRoute>} />
              <Route path="/finance/reports" element={<ProtectedRoute><FinanceReports /></ProtectedRoute>} />

              {/* Donor */}
              <Route path="/donor" element={<ProtectedRoute><DonorDashboard /></ProtectedRoute>} />
              <Route path="/donor/donations" element={<ProtectedRoute><MyDonations /></ProtectedRoute>} />
              <Route path="/donor/impact" element={<ProtectedRoute><ImpactReports /></ProtectedRoute>} />

              {/* Beneficiary */}
              <Route path="/beneficiary" element={<ProtectedRoute><BeneficiaryDashboard /></ProtectedRoute>} />
              <Route path="/beneficiary/services" element={<ProtectedRoute><Services /></ProtectedRoute>} />
              <Route path="/beneficiary/notifications" element={<ProtectedRoute><BeneficiaryNotifications /></ProtectedRoute>} />

              {/* Caregiver */}
              <Route path="/caregiver" element={<ProtectedRoute><CaregiverDashboard /></ProtectedRoute>} />
              <Route path="/caregiver/schedule" element={<ProtectedRoute><CaregiverSchedule /></ProtectedRoute>} />
              <Route path="/caregiver/beneficiaries" element={<ProtectedRoute><BeneficiaryList /></ProtectedRoute>} />
              <Route path="/caregiver/logs" element={<ProtectedRoute><CaregiverLogs /></ProtectedRoute>} />

              {/* Volunteer */}
              <Route path="/volunteer" element={<ProtectedRoute><VolunteerDashboard /></ProtectedRoute>} />
              <Route path="/volunteer/opportunities" element={<ProtectedRoute><Opportunities /></ProtectedRoute>} />
              <Route path="/volunteer/hours" element={<ProtectedRoute><MyHours /></ProtectedRoute>} />
              <Route path="/volunteer/events" element={<ProtectedRoute><Events /></ProtectedRoute>} />

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
};

export default App;