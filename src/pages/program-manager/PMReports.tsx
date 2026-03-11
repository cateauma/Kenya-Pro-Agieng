import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageWrapper } from "@/components/dashboard/PageWrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { program: "Meals", beneficiaries: 85, completion: 95 },
  { program: "Youth", beneficiaries: 40, completion: 60 },
  { program: "Health", beneficiaries: 55, completion: 78 },
  { program: "Saccos", beneficiaries: 30, completion: 45 },
  { program: "Counsel", beneficiaries: 25, completion: 35 },
];

export default function PMReports() {
  return (
    <DashboardLayout>
      <PageWrapper
        title="Program Reports"
        subtitle="Performance metrics and outcomes"
        actions={<Button variant="outline"><Download className="mr-2 h-4 w-4" /> Export</Button>}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-heading">Program Completion Rates</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="program" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip />
                <Bar dataKey="completion" fill="hsl(145, 35%, 38%)" radius={[4, 4, 0, 0]} name="Completion %" />
                <Bar dataKey="beneficiaries" fill="hsl(42, 80%, 55%)" radius={[4, 4, 0, 0]} name="Beneficiaries" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </PageWrapper>
    </DashboardLayout>
  );
}
