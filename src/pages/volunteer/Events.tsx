import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageWrapper } from "@/components/dashboard/PageWrapper";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, Loader2 } from "lucide-react";
import {
  fetchOpportunities,
  fetchMySignups,
  signupForOpportunity,
  cancelSignup,
  type Opportunity,
  type VolunteerSignup,
} from "@/lib/api/opportunities";
import { hasBackendConfig } from "@/lib/api/client";

function formatEventDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "short" });
}

export default function Events() {
  const [events, setEvents] = useState<Opportunity[]>([]);
  const [mySignups, setMySignups] = useState<VolunteerSignup[]>([]);
  const [loading, setLoading] = useState(true);
  const [actingId, setActingId] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    Promise.all([fetchOpportunities("event"), fetchMySignups()])
      .then(([evts, signups]) => {
        setEvents(evts);
        setMySignups(signups);
      })
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const signedUpIds = new Set(mySignups.map((s) => s.opportunity_id));

  const handleRsvp = async (event: Opportunity) => {
    setActingId(event.id);
    try {
      await signupForOpportunity(event.id);
      load();
    } finally {
      setActingId(null);
    }
  };

  const handleCancel = async (event: Opportunity) => {
    setActingId(event.id);
    try {
      await cancelSignup(event.id);
      load();
    } finally {
      setActingId(null);
    }
  };

  const now = new Date().toISOString().slice(0, 10);
  const isPast = (dateStr: string) => dateStr < now;

  const fallback: Opportunity[] = hasBackendConfig()
    ? []
    : [
        { id: "1", title: "Community Meal Distribution", date: "2026-03-15", location: "Karen Community Center", slots: 25, category: "Meals", type: "event" },
        { id: "2", title: "Home Visit Training Session", date: "2026-03-22", location: "KPAO Office", slots: 15, category: "Training", type: "event" },
      ];
  const list = events.length ? events : fallback;

  return (
    <DashboardLayout>
      <PageWrapper title="Events" subtitle="Community events and gatherings">
        {loading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        )}
        {!loading && list.length === 0 && (
          <p className="text-muted-foreground text-sm">No events right now. Check back later.</p>
        )}
        <div className="space-y-4">
          {!loading && list.map((event) => {
            const signedUp = signedUpIds.has(event.id);
            const busy = actingId === event.id;
            const past = isPast(event.date);
            const attendees = event.signed_up_count ?? 0;
            return (
              <Card key={event.id} className="hover:shadow-sm transition-shadow">
                <CardContent className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4">
                  <div>
                    <h3 className="font-heading font-semibold text-sm">{event.title}</h3>
                    <div className="flex flex-wrap gap-3 mt-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{formatEventDate(event.date)}</span>
                      <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{event.location}</span>
                      <span className="flex items-center gap-1"><Users className="h-3 w-3" />{attendees} attending</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={past ? "secondary" : "default"} className="text-xs">
                      {past ? "Completed" : "Upcoming"}
                    </Badge>
                    {hasBackendConfig() && !past && (
                      signedUp ? (
                        <>
                          <Badge variant="outline">You're in</Badge>
                          <Button size="sm" variant="outline" disabled={busy} onClick={() => handleCancel(event)}>
                            {busy ? <Loader2 className="h-3 w-3 animate-spin" /> : "Cancel RSVP"}
                          </Button>
                        </>
                      ) : (
                        <Button size="sm" disabled={busy} onClick={() => handleRsvp(event)}>
                          {busy ? <Loader2 className="h-3 w-3 animate-spin" /> : "RSVP"}
                        </Button>
                      )
                    )}
                    {!hasBackendConfig() && !past && <Button size="sm" disabled>RSVP (connect backend)</Button>}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </PageWrapper>
    </DashboardLayout>
  );
}
