import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { ActivityList } from "@/components/dashboard/ActivityList";
import { Heart, Calendar, Clock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function VolunteerDashboard() {
  return (
    <DashboardLayout>
      <div className="page-header flex items-center justify-between">
        <div>
          <h1 className="page-title">Volunteer Dashboard</h1>
          <p className="page-subtitle">Make an impact in your community</p>
        </div>
        <Button>
          <Heart className="mr-2 h-4 w-4" /> Browse Opportunities
        </Button>
      </div>
      <div className="dashboard-grid mb-6">
        <StatCard title="Hours Logged" value={64} icon={Clock} trend="12h this month" trendUp />
        <StatCard title="Upcoming Events" value={3} icon={Calendar} />
        <StatCard title="People Helped" value={28} icon={Users} />
        <StatCard title="Opportunities" value={8} icon={Heart} trend="5 new" />
      </div>
      <ActivityList title="Upcoming Activities" activities={[
        { id: "1", text: "Community meal distribution — Karen", time: "Saturday, 9:00 AM", type: "info" },
        { id: "2", text: "Intergenerational youth event", time: "Next Tuesday", type: "info" },
        { id: "3", text: "Home visit training session", time: "March 15", type: "info" },
      ]} />
    </DashboardLayout>
  );
}
