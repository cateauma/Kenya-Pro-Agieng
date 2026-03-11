import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageWrapper } from "@/components/dashboard/PageWrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { StatCard } from "@/components/dashboard/StatCard";
import { Wallet, TrendingUp, TrendingDown, PiggyBank } from "lucide-react";

const budgetItems = [
  { category: "Meal Programs", allocated: 150000, spent: 125000 },
  { category: "Healthcare", allocated: 80000, spent: 62000 },
  { category: "Staff Salaries", allocated: 200000, spent: 200000 },
  { category: "Transport & Logistics", allocated: 40000, spent: 35000 },
  { category: "Counseling Services", allocated: 30000, spent: 18000 },
  { category: "Events & Activities", allocated: 25000, spent: 12000 },
];

export default function Budget() {
  const totalAllocated = budgetItems.reduce((s, b) => s + b.allocated, 0);
  const totalSpent = budgetItems.reduce((s, b) => s + b.spent, 0);

  return (
    <DashboardLayout>
      <PageWrapper title="Budget Overview" subtitle="Monthly budget allocation and spending">
        <div className="dashboard-grid mb-6">
          <StatCard title="Total Budget" value={`KES ${(totalAllocated / 1000).toFixed(0)}K`} icon={Wallet} />
          <StatCard title="Total Spent" value={`KES ${(totalSpent / 1000).toFixed(0)}K`} icon={TrendingDown} />
          <StatCard title="Remaining" value={`KES ${((totalAllocated - totalSpent) / 1000).toFixed(0)}K`} icon={PiggyBank} />
          <StatCard title="Utilization" value={`${Math.round((totalSpent / totalAllocated) * 100)}%`} icon={TrendingUp} />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-heading">Budget by Category</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {budgetItems.map((item) => {
              const pct = Math.round((item.spent / item.allocated) * 100);
              return (
                <div key={item.category} className="space-y-1.5">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{item.category}</span>
                    <span className="text-muted-foreground">
                      KES {(item.spent / 1000).toFixed(0)}K / {(item.allocated / 1000).toFixed(0)}K ({pct}%)
                    </span>
                  </div>
                  <Progress value={pct} className="h-2" />
                </div>
              );
            })}
          </CardContent>
        </Card>
      </PageWrapper>
    </DashboardLayout>
  );
}
