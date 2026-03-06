import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { ActivityList } from "@/components/dashboard/ActivityList";
import { Heart, Calendar, Bell, ClipboardList } from "lucide-react";

export default function BeneficiaryDashboard() {
  return (
    <DashboardLayout>
      <div className="page-header">
        <h1 className="page-title">My Dashboard</h1>
        <p className="page-subtitle">Your care plan and services</p>
      </div>
      <div className="dashboard-grid mb-6">
        <StatCard title="Care Plan Status" value="Active" icon={ClipboardList} />
        <StatCard title="Next Appointment" value="Mar 10" icon={Calendar} />
        <StatCard title="Services Received" value={12} icon={Heart} trend="This month" />
        <StatCard title="Notifications" value={3} icon={Bell} />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <ActivityList title="Upcoming Services" activities={[
          { id: "1", text: "Meal delivery — Tuesday & Thursday", time: "Weekly", type: "info" },
          { id: "2", text: "Health check-up with Dr. Ochieng", time: "March 10, 2:00 PM", type: "info" },
          { id: "3", text: "Financial counseling — Sacco introduction", time: "March 12", type: "info" },
        ]} />
        <ActivityList title="Recent Activity" activities={[
          { id: "4", text: "Home visit completed by Mary", time: "Yesterday", type: "success" },
          { id: "5", text: "Clothing distribution — received 3 items", time: "March 2", type: "success" },
          { id: "6", text: "Blood pressure check — normal", time: "Feb 28", type: "success" },
        ]} />
      </div>
    </DashboardLayout>
  );
}
