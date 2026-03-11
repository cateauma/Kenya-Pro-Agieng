import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageWrapper } from "@/components/dashboard/PageWrapper";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Utensils, Stethoscope, Home, Users, Wallet } from "lucide-react";

const services = [
  { name: "Meal Delivery", icon: Utensils, description: "Nutritious meals delivered to your home twice a week", active: true },
  { name: "Health Monitoring", icon: Stethoscope, description: "Regular check-ups and vital sign tracking", active: true },
  { name: "Home Visits", icon: Home, description: "Social worker and caregiver home visits", active: true },
  { name: "Counseling", icon: Heart, description: "Emotional support and group therapy sessions", active: true },
  { name: "Community Activities", icon: Users, description: "Intergenerational events and social gatherings", active: false },
  { name: "Financial Support", icon: Wallet, description: "Linkage to saccos, chamas, and financial advice", active: false },
];

export default function Services() {
  return (
    <DashboardLayout>
      <PageWrapper title="Available Services" subtitle="Services you can access through KPAO">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <Card key={s.name} className={`hover:shadow-md transition-shadow ${!s.active ? "opacity-60" : ""}`}>
              <CardContent className="pt-6">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                  <s.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-heading font-semibold text-sm mb-1">{s.name}</h3>
                <p className="text-xs text-muted-foreground">{s.description}</p>
                <p className="text-xs mt-2 font-medium text-primary">{s.active ? "✓ Currently enrolled" : "Request enrollment"}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </PageWrapper>
    </DashboardLayout>
  );
}
