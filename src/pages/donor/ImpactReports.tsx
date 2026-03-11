import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageWrapper } from "@/components/dashboard/PageWrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/dashboard/StatCard";
import { Heart, Users, Utensils, Home } from "lucide-react";

const impactStories = [
  { title: "Meal Program — Nairobi", description: "Your contributions helped provide 3,400 meals to 85 elderly beneficiaries in Nairobi this quarter.", metric: "3,400 meals" },
  { title: "Home Visits — Westlands", description: "Funding supported 120 home visits for isolated elderly residents, ensuring regular health checks.", metric: "120 visits" },
  { title: "Clothing Distribution", description: "In-kind donations were distributed to 45 beneficiaries during the February drive.", metric: "45 beneficiaries" },
];

export default function ImpactReports() {
  return (
    <DashboardLayout>
      <PageWrapper title="Impact Reports" subtitle="See how your donations make a difference">
        <div className="dashboard-grid mb-6">
          <StatCard title="Lives Impacted" value={34} icon={Heart} trendUp />
          <StatCard title="Meals Funded" value="3,400" icon={Utensils} />
          <StatCard title="Home Visits" value={120} icon={Home} />
          <StatCard title="Programs Supported" value={4} icon={Users} />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {impactStories.map((story) => (
            <Card key={story.title} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="text-sm font-heading">{story.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">{story.description}</p>
                <p className="text-lg font-bold text-primary">{story.metric}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </PageWrapper>
    </DashboardLayout>
  );
}
