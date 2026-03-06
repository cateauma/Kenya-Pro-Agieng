import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { ActivityList } from "@/components/dashboard/ActivityList";
import { HandCoins, Heart, TrendingUp, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DonorDashboard() {
  return (
    <DashboardLayout>
      <div className="page-header flex items-center justify-between">
        <div>
          <h1 className="page-title">Donor Dashboard</h1>
          <p className="page-subtitle">Your contributions make a difference</p>
        </div>
        <Button>
          <HandCoins className="mr-2 h-4 w-4" /> Make Donation
        </Button>
      </div>
      <div className="dashboard-grid mb-6">
        <StatCard title="Total Donated" value="KES 125,000" icon={HandCoins} />
        <StatCard title="Lives Impacted" value={34} icon={Heart} trend="12 this year" trendUp />
        <StatCard title="Donation Streak" value="6 months" icon={TrendingUp} />
        <StatCard title="In-Kind Gifts" value={5} icon={Gift} />
      </div>
      <ActivityList title="Donation History" activities={[
        { id: "1", text: "KES 10,000 — Monthly contribution", time: "March 1, 2026", type: "success" },
        { id: "2", text: "Clothing donation — 20 items delivered", time: "Feb 15, 2026", type: "info" },
        { id: "3", text: "KES 10,000 — Monthly contribution", time: "Feb 1, 2026", type: "success" },
      ]} />
    </DashboardLayout>
  );
}
