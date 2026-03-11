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

// Admin sub-pages
import UserManagement from "./pages/admin/UserManagement";
import Approvals from "./pages/admin/Approvals";
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
import CarePlan from "./pages/beneficiary/CarePlan";
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

            {/* Admin */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<UserManagement />} />
            <Route path="/admin/approvals" element={<Approvals />} />
            <Route path="/admin/reports" element={<Reports />} />
            <Route path="/admin/settings" element={<AdminSettings />} />

            {/* Program Manager */}
            <Route path="/program-manager" element={<ProgramManagerDashboard />} />
            <Route path="/program-manager/programs" element={<Programs />} />
            <Route path="/program-manager/assignments" element={<Assignments />} />
            <Route path="/program-manager/reports" element={<PMReports />} />

            {/* Social Worker */}
            <Route path="/social-worker" element={<SocialWorkerDashboard />} />
            <Route path="/social-worker/cases" element={<Cases />} />
            <Route path="/social-worker/visits" element={<HomeVisits />} />
            <Route path="/social-worker/counseling" element={<Counseling />} />

            {/* Healthcare */}
            <Route path="/healthcare" element={<HealthcareDashboard />} />
            <Route path="/healthcare/records" element={<HealthRecords />} />
            <Route path="/healthcare/appointments" element={<Appointments />} />

            {/* Finance */}
            <Route path="/finance" element={<FinanceDashboard />} />
            <Route path="/finance/donations" element={<Donations />} />
            <Route path="/finance/budget" element={<Budget />} />
            <Route path="/finance/reports" element={<FinanceReports />} />

            {/* Donor */}
            <Route path="/donor" element={<DonorDashboard />} />
            <Route path="/donor/donations" element={<MyDonations />} />
            <Route path="/donor/impact" element={<ImpactReports />} />

            {/* Beneficiary */}
            <Route path="/beneficiary" element={<BeneficiaryDashboard />} />
            <Route path="/beneficiary/care-plan" element={<CarePlan />} />
            <Route path="/beneficiary/services" element={<Services />} />
            <Route path="/beneficiary/notifications" element={<BeneficiaryNotifications />} />

            {/* Caregiver */}
            <Route path="/caregiver" element={<CaregiverDashboard />} />
            <Route path="/caregiver/schedule" element={<CaregiverSchedule />} />
            <Route path="/caregiver/beneficiaries" element={<BeneficiaryList />} />
            <Route path="/caregiver/logs" element={<CaregiverLogs />} />

            {/* Volunteer */}
            <Route path="/volunteer" element={<VolunteerDashboard />} />
            <Route path="/volunteer/opportunities" element={<Opportunities />} />
            <Route path="/volunteer/hours" element={<MyHours />} />
            <Route path="/volunteer/events" element={<Events />} />

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
