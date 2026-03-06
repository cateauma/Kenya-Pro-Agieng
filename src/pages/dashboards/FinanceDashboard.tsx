import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { ActivityList } from "@/components/dashboard/ActivityList";
import { HandCoins, Wallet, TrendingUp, FileText } from "lucide-react";

export default function FinanceDashboard() {
  return (
    <DashboardLayout>
      <div className="page-header">
        <h1 className="page-title">Finance Manager</h1>
        <p className="page-subtitle">Donations and budget oversight</p>
      </div>
      <div className="dashboard-grid mb-6">
        <StatCard title="Total Donations" value="KES 2.4M" icon={HandCoins} trend="18% growth" trendUp />
        <StatCard title="Monthly Budget" value="KES 380K" icon={Wallet} />
        <StatCard title="Disbursements" value="KES 290K" icon={TrendingUp} trend="76% utilized" />
        <StatCard title="Pending Reports" value={3} icon={FileText} />
      </div>
      <ActivityList title="Recent Transactions" activities={[
        { id: "1", text: "KES 50,000 received from Safaricom Foundation", time: "Today", type: "success" },
        { id: "2", text: "KES 15,000 disbursed for meal program", time: "Yesterday", type: "info" },
        { id: "3", text: "Quarterly report due in 3 days", time: "Reminder", type: "warning" },
      ]} />
    </DashboardLayout>
  );
}
