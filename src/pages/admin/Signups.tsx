import { useQuery } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageWrapper } from "@/components/dashboard/PageWrapper";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, User, Loader2 } from "lucide-react";
import { fetchAdminSignups, type AdminSignup } from "@/lib/api/admin";
import { format } from "date-fns";
import { hasBackendConfig } from "@/lib/api/client";

function formatDate(dateStr: string | undefined): string {
  if (!dateStr) return "—";
  return format(new Date(dateStr), "MMM d, yyyy");
}

export default function Signups() {
  const { data: signups = [], isLoading, error } = useQuery({
    queryKey: ["admin", "signups"],
    queryFn: fetchAdminSignups,
    enabled: hasBackendConfig(),
  });

  if (!hasBackendConfig()) {
    return (
      <DashboardLayout>
        <PageWrapper title="Event signups" subtitle="Volunteer RSVPs for events and opportunities">
          <p className="text-muted-foreground text-sm">Connect the backend to view signups.</p>
        </PageWrapper>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <PageWrapper title="Event signups" subtitle="Volunteer RSVPs for events and opportunities">
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        )}
        {error && (
          <p className="text-destructive text-sm">Failed to load signups. Please try again.</p>
        )}
        {!isLoading && !error && signups.length === 0 && (
          <p className="text-muted-foreground text-sm">No signups yet. Volunteers can sign up from their Opportunities and Events pages.</p>
        )}
        {!isLoading && !error && signups.length > 0 && (
          <div className="space-y-3">
            {signups.map((s: AdminSignup) => (
              <Card key={s.id} className="hover:shadow-sm transition-shadow">
                <CardContent className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-sm">{s.volunteer_name}</span>
                      <span className="text-muted-foreground text-xs">{s.volunteer_email}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <User className="h-3 w-3" />
                      <span>Volunteer</span>
                    </div>
                  </div>
                  <div className="text-sm">
                    <p className="font-medium">{s.opportunity_title}</p>
                    <div className="flex flex-wrap gap-3 mt-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{formatDate(s.opportunity_date)}</span>
                      {s.opportunity_location && (
                        <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{s.opportunity_location}</span>
                      )}
                    </div>
                    <Badge variant="secondary" className="mt-2 text-xs">
                      {s.opportunity_type === "event" ? "Event" : "Opportunity"}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground shrink-0">
                    Signed up {format(new Date(s.created_at), "MMM d, yyyy 'at' HH:mm")}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </PageWrapper>
    </DashboardLayout>
  );
}
