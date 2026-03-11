import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageWrapper } from "@/components/dashboard/PageWrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, Clock } from "lucide-react";

const opportunities = [
  { title: "Meal Distribution — Nairobi", date: "Mar 15", location: "Karen", slots: 5, duration: "3h", category: "Meals" },
  { title: "Home Visit Companion", date: "Mar 16", location: "Westlands", slots: 2, duration: "4h", category: "Visits" },
  { title: "Youth-Elder Story Circle", date: "Mar 18", location: "City Center", slots: 10, duration: "2h", category: "Events" },
  { title: "Health Screening Support", date: "Mar 20", location: "Kibera", slots: 3, duration: "5h", category: "Health" },
  { title: "Clothing Drive Sorting", date: "Mar 22", location: "Langata", slots: 8, duration: "3h", category: "Logistics" },
  { title: "Community Garden Maintenance", date: "Mar 25", location: "Dagoretti", slots: 6, duration: "4h", category: "Community" },
];

export default function Opportunities() {
  return (
    <DashboardLayout>
      <PageWrapper title="Volunteer Opportunities" subtitle="Find ways to make an impact">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {opportunities.map((opp) => (
            <Card key={opp.title} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-sm font-heading">{opp.title}</CardTitle>
                  <Badge variant="secondary" className="text-xs shrink-0 ml-2">{opp.category}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{opp.date}</span>
                  <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{opp.location}</span>
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{opp.duration}</span>
                  <span className="flex items-center gap-1"><Users className="h-3 w-3" />{opp.slots} slots</span>
                </div>
                <Button size="sm" className="w-full mt-2">Sign Up</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </PageWrapper>
    </DashboardLayout>
  );
}
