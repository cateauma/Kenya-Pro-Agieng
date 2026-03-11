import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageWrapper } from "@/components/dashboard/PageWrapper";
import { DataTable, Column } from "@/components/dashboard/DataTable";
import { StatCard } from "@/components/dashboard/StatCard";
import { Clock, Calendar, TrendingUp, Award } from "lucide-react";

interface HoursRow {
  date: string;
  activity: string;
  location: string;
  hours: number;
}

const hoursLog: HoursRow[] = [
  { date: "Mar 8", activity: "Meal distribution", location: "Karen", hours: 3 },
  { date: "Mar 5", activity: "Home visit companion", location: "Westlands", hours: 4 },
  { date: "Mar 1", activity: "Health screening help", location: "Kibera", hours: 5 },
  { date: "Feb 25", activity: "Clothing drive sorting", location: "Langata", hours: 3 },
  { date: "Feb 20", activity: "Story circle event", location: "City Center", hours: 2 },
  { date: "Feb 15", activity: "Garden maintenance", location: "Dagoretti", hours: 4 },
];

const columns: Column<HoursRow>[] = [
  { key: "date", label: "Date" },
  { key: "activity", label: "Activity" },
  { key: "location", label: "Location" },
  { key: "hours", label: "Hours", render: (r) => <span className="font-medium">{r.hours}h</span> },
];

export default function MyHours() {
  return (
    <DashboardLayout>
      <PageWrapper title="My Hours" subtitle="Track your volunteer contributions">
        <div className="dashboard-grid mb-6">
          <StatCard title="Total Hours" value={64} icon={Clock} />
          <StatCard title="This Month" value="12h" icon={Calendar} trendUp />
          <StatCard title="Streak" value="6 weeks" icon={TrendingUp} />
          <StatCard title="Rank" value="Gold" icon={Award} />
        </div>
        <DataTable columns={columns} data={hoursLog} searchKey="activity" searchPlaceholder="Search activities..." />
      </PageWrapper>
    </DashboardLayout>
  );
}
