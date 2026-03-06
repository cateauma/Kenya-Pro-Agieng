import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { ActivityList } from "@/components/dashboard/ActivityList";
import { ClipboardList, Users, Calendar, TrendingUp } from "lucide-react";

export default function ProgramManagerDashboard() {
  return (
    <DashboardLayout>
      <div className="page-header">
        <h1 className="page-title">Program Manager</h1>
        <p className="page-subtitle">Oversee programs and assignments</p>
      </div>
      <div className="dashboard-grid mb-6">
        <StatCard title="Active Programs" value={8} icon={ClipboardList} trend="2 new this month" trendUp />
        <StatCard title="Team Members" value={24} icon={Users} />
        <StatCard title="Upcoming Events" value={6} icon={Calendar} />
        <StatCard title="Completion Rate" value="87%" icon={TrendingUp} trend="5% improvement" trendUp />
      </div>
      <ActivityList title="Recent Updates" activities={[
        { id: "1", text: "Meal distribution program reached 95% coverage", time: "2 hours ago", type: "success" },
        { id: "2", text: "New intergenerational program launched in Kisumu", time: "Yesterday", type: "info" },
        { id: "3", text: "Volunteer shortage in Nakuru region", time: "2 days ago", type: "warning" },
      ]} />
    </DashboardLayout>
  );
}
