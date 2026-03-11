import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageWrapper } from "@/components/dashboard/PageWrapper";
import { StatCard } from "@/components/dashboard/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Users, Heart, HandCoins, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const monthlyData = [
  { month: "Oct", users: 180, donations: 320000 },
  { month: "Nov", users: 195, donations: 410000 },
  { month: "Dec", users: 210, donations: 580000 },
  { month: "Jan", users: 225, donations: 390000 },
  { month: "Feb", users: 238, donations: 450000 },
  { month: "Mar", users: 248, donations: 520000 },
];

const roleDistribution = [
  { name: "Beneficiaries", value: 142, color: "hsl(18, 76%, 45%)" },
  { name: "Volunteers", value: 45, color: "hsl(145, 35%, 38%)" },
  { name: "Donors", value: 32, color: "hsl(42, 80%, 55%)" },
  { name: "Caregivers", value: 18, color: "hsl(210, 60%, 50%)" },
  { name: "Staff", value: 11, color: "hsl(20, 25%, 15%)" },
];

export default function Reports() {
  return (
    <DashboardLayout>
      <PageWrapper
        title="Reports & Analytics"
        subtitle="System-wide insights and data"
        actions={<Button variant="outline"><Download className="mr-2 h-4 w-4" /> Export</Button>}
      >
        <div className="dashboard-grid mb-6">
          <StatCard title="Total Users" value={248} icon={Users} trend="+12% MoM" trendUp />
          <StatCard title="Active Beneficiaries" value={142} icon={Heart} />
          <StatCard title="Total Donations" value="KES 2.4M" icon={HandCoins} trendUp />
          <StatCard title="Growth Rate" value="18%" icon={TrendingUp} trendUp />
        </div>

        <div className="grid gap-4 md:grid-cols-2 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-heading">Monthly Growth</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip />
                  <Bar dataKey="users" fill="hsl(18, 76%, 45%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base font-heading">User Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={roleDistribution} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {roleDistribution.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </PageWrapper>
    </DashboardLayout>
  );
}
