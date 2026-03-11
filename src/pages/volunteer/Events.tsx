import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageWrapper } from "@/components/dashboard/PageWrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users } from "lucide-react";

const events = [
  { title: "Community Meal Distribution", date: "Saturday, Mar 15", location: "Karen Community Center", attendees: 25, status: "Upcoming" },
  { title: "Intergenerational Youth Event", date: "Tuesday, Mar 18", location: "Nairobi Youth Hub", attendees: 40, status: "Upcoming" },
  { title: "Home Visit Training Session", date: "Saturday, Mar 22", location: "KPAO Office", attendees: 15, status: "Upcoming" },
  { title: "Health Awareness Walk", date: "Sunday, Mar 30", location: "Uhuru Park", attendees: 60, status: "Upcoming" },
  { title: "February Clothing Drive", date: "Feb 15, 2026", location: "Langata Center", attendees: 30, status: "Completed" },
];

export default function Events() {
  return (
    <DashboardLayout>
      <PageWrapper title="Events" subtitle="Community events and gatherings">
        <div className="space-y-4">
          {events.map((event) => (
            <Card key={event.title} className="hover:shadow-sm transition-shadow">
              <CardContent className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4">
                <div>
                  <h3 className="font-heading font-semibold text-sm">{event.title}</h3>
                  <div className="flex flex-wrap gap-3 mt-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{event.date}</span>
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{event.location}</span>
                    <span className="flex items-center gap-1"><Users className="h-3 w-3" />{event.attendees} attending</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={event.status === "Completed" ? "secondary" : "default"} className="text-xs">
                    {event.status}
                  </Badge>
                  {event.status !== "Completed" && <Button size="sm">RSVP</Button>}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </PageWrapper>
    </DashboardLayout>
  );
}
