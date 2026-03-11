import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageWrapper } from "@/components/dashboard/PageWrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/dashboard/DataTable";
import { Plus, Users, Calendar } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const programs = [
  { name: "Meal Distribution Program", region: "Nairobi", beneficiaries: 85, progress: 95, status: "Active" },
  { name: "Intergenerational Youth Activities", region: "Kisumu", beneficiaries: 40, progress: 60, status: "Active" },
  { name: "Health Monitoring Initiative", region: "Mombasa", beneficiaries: 55, progress: 78, status: "Active" },
  { name: "Financial Literacy & Saccos", region: "Nakuru", beneficiaries: 30, progress: 45, status: "Active" },
  { name: "Clothing Distribution Drive", region: "Nairobi", beneficiaries: 120, progress: 100, status: "Completed" },
  { name: "Community Counseling", region: "Eldoret", beneficiaries: 25, progress: 35, status: "Active" },
];

export default function Programs() {
  return (
    <DashboardLayout>
      <PageWrapper
        title="Programs"
        subtitle="Manage and monitor all programs"
        actions={<Button><Plus className="mr-2 h-4 w-4" /> New Program</Button>}
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {programs.map((p) => (
            <Card key={p.name} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-sm font-heading">{p.name}</CardTitle>
                  <StatusBadge status={p.status} />
                </div>
                <Badge variant="outline" className="w-fit text-xs">{p.region}</Badge>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-3.5 w-3.5" />
                  <span>{p.beneficiaries} beneficiaries</span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{p.progress}%</span>
                  </div>
                  <Progress value={p.progress} className="h-2" />
                </div>
                <Button variant="outline" size="sm" className="w-full">View Details</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </PageWrapper>
    </DashboardLayout>
  );
}
