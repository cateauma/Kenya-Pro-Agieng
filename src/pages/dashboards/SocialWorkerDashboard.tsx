import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { ActivityList } from "@/components/dashboard/ActivityList";
import { ClipboardList, Home, Heart, Users } from "lucide-react";

export default function SocialWorkerDashboard() {
  return (
    <DashboardLayout>
      <div className="page-header">
        <h1 className="page-title">Social Worker</h1>
        <p className="page-subtitle">Case management and elderly care</p>
      </div>
      <div className="dashboard-grid mb-6">
        <StatCard title="Active Cases" value={18} icon={ClipboardList} />
        <StatCard title="Home Visits Today" value={4} icon={Home} />
        <StatCard title="Counseling Sessions" value={6} icon={Heart} trend="2 scheduled today" />
        <StatCard title="Beneficiaries" value={32} icon={Users} />
      </div>
      <ActivityList title="Today's Schedule" activities={[
        { id: "1", text: "Home visit — Mama Njeri, Westlands", time: "9:00 AM", type: "info" },
        { id: "2", text: "Counseling session — Group therapy", time: "11:00 AM", type: "info" },
        { id: "3", text: "Assessment — New beneficiary intake", time: "2:00 PM", type: "warning" },
        { id: "4", text: "Follow-up call — Mr. Kamau", time: "4:00 PM", type: "info" },
      ]} />
    </DashboardLayout>
  );
}
