import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageWrapper } from "@/components/dashboard/PageWrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, AlertCircle } from "lucide-react";

const carePlanItems = [
  { service: "Weekly Meal Delivery", frequency: "Tue & Thu", status: "active", next: "Mar 11" },
  { service: "Monthly Health Check-up", frequency: "Monthly", status: "upcoming", next: "Mar 15" },
  { service: "Financial Counseling — Sacco Intro", frequency: "One-time", status: "upcoming", next: "Mar 12" },
  { service: "Counseling Sessions", frequency: "Bi-weekly", status: "active", next: "Mar 18" },
  { service: "Home Visits", frequency: "Weekly", status: "active", next: "Mar 13" },
  { service: "Clothing Support", frequency: "Quarterly", status: "completed", next: "Jun 2026" },
];

const statusIcons = {
  active: <CheckCircle className="h-4 w-4 text-success" />,
  upcoming: <Clock className="h-4 w-4 text-warning" />,
  completed: <AlertCircle className="h-4 w-4 text-info" />,
};

export default function CarePlan() {
  return (
    <DashboardLayout>
      <PageWrapper title="My Care Plan" subtitle="Your personalized care services">
        <div className="space-y-3">
          {carePlanItems.map((item) => (
            <Card key={item.service} className="hover:shadow-sm transition-shadow">
              <CardContent className="flex items-center justify-between py-4">
                <div className="flex items-center gap-3">
                  {statusIcons[item.status as keyof typeof statusIcons]}
                  <div>
                    <p className="font-medium text-sm">{item.service}</p>
                    <p className="text-xs text-muted-foreground">{item.frequency}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="outline" className="text-xs">Next: {item.next}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </PageWrapper>
    </DashboardLayout>
  );
}
