import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { ActivityList } from "@/components/dashboard/ActivityList";
import { Users, UserCheck, Heart, HandCoins, AlertTriangle, Calendar } from "lucide-react";

const activities = [
  { id: "1", text: "New volunteer registration from Jane Wanjiku", time: "5 minutes ago", type: "info" as const },
  { id: "2", text: "Donation of KES 50,000 received from Partner NGO", time: "1 hour ago", type: "success" as const },
  { id: "3", text: "3 pending user approvals require attention", time: "2 hours ago", type: "warning" as const },
  { id: "4", text: "Home visit completed for beneficiary #142", time: "3 hours ago", type: "success" as const },
  { id: "5", text: "Monthly health report generated", time: "Yesterday", type: "info" as const },
];

const pendingApprovals = [
  { id: "a1", text: "Mary Akinyi — Volunteer registration", time: "Pending since 2 days", type: "warning" as const },
  { id: "a2", text: "John Omondi — Beneficiary enrollment", time: "Pending since 1 day", type: "warning" as const },
  { id: "a3", text: "Grace Muthoni — Donor account", time: "Pending since 3 hours", type: "info" as const },
];

export default function AdminDashboard() {
  return (
    <DashboardLayout>
      <div className="page-header">
        <h1 className="page-title">Admin Dashboard</h1>
        <p className="page-subtitle">System overview and management</p>
      </div>

      <div className="dashboard-grid mb-6">
        <StatCard title="Total Users" value={248} icon={Users} trend="12% from last month" trendUp />
        <StatCard title="Pending Approvals" value={7} icon={UserCheck} trend="3 new today" />
        <StatCard title="Active Beneficiaries" value={142} icon={Heart} trend="5% increase" trendUp />
        <StatCard title="Total Donations" value="KES 2.4M" icon={HandCoins} trend="18% this quarter" trendUp />
      </div>

      <div className="grid gap-4 md:grid-cols-2 mb-6">
        <StatCard title="Pending Issues" value={5} icon={AlertTriangle} />
        <StatCard title="Scheduled Events" value={12} icon={Calendar} trend="3 this week" />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <ActivityList title="Recent Activity" activities={activities} />
        <ActivityList title="Pending Approvals" activities={pendingApprovals} />
      </div>
    </DashboardLayout>
  );
}
