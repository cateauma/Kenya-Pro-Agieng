import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageWrapper } from "@/components/dashboard/PageWrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, Clock, Loader2 } from "lucide-react";
import {
  fetchOpportunities,
  fetchMySignups,
  signupForOpportunity,
  cancelSignup,
  type Opportunity,
  type VolunteerSignup,
} from "@/lib/api/opportunities";
import { hasBackendConfig } from "@/lib/api/client";

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

export default function Opportunities() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [mySignups, setMySignups] = useState<VolunteerSignup[]>([]);
  const [loading, setLoading] = useState(true);
  const [actingId, setActingId] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    Promise.all([fetchOpportunities("opportunity"), fetchMySignups()])
      .then(([opps, signups]) => {
        setOpportunities(opps);
        setMySignups(signups);
      })
      .catch(() => setOpportunities([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const signedUpIds = new Set(mySignups.map((s) => s.opportunity_id));

  const handleSignup = async (opp: Opportunity) => {
    setActingId(opp.id);
    try {
      await signupForOpportunity(opp.id);
      load();
    } finally {
      setActingId(null);
    }
  };

  const handleCancel = async (opp: Opportunity) => {
    setActingId(opp.id);
    try {
      await cancelSignup(opp.id);
      load();
    } finally {
      setActingId(null);
    }
  };

  const fallback = [
    { id: "1", title: "Meal Distribution — Nairobi", date: "2026-03-15", location: "Karen", slots: 5, duration_hours: 3, category: "Meals", type: "opportunity" as const },
    { id: "2", title: "Home Visit Companion", date: "2026-03-16", location: "Westlands", slots: 2, duration_hours: 4, category: "Visits", type: "opportunity" as const },
  ];
  const list = opportunities.length ? opportunities : (hasBackendConfig() ? [] : fallback);

  return (
    <DashboardLayout>
      <PageWrapper title="Volunteer Opportunities" subtitle="Find ways to make an impact">
        {loading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        )}
        {!loading && list.length === 0 && (
          <p className="text-muted-foreground text-sm">No opportunities right now. Check back later.</p>
        )}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {!loading && list.map((opp) => {
            const signedUp = signedUpIds.has(opp.id);
            const busy = actingId === opp.id;
            const slotsLeft = (opp.slots ?? 0) - (opp.signed_up_count ?? 0);
            return (
              <Card key={opp.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-sm font-heading">{opp.title}</CardTitle>
                    <Badge variant="secondary" className="text-xs shrink-0 ml-2">{opp.category}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{formatDate(opp.date)}</span>
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{opp.location}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{opp.duration_hours ?? 0}h</span>
                    <span className="flex items-center gap-1"><Users className="h-3 w-3" />{slotsLeft > 0 ? `${slotsLeft} slots` : "Full"}</span>
                  </div>
                  {hasBackendConfig() ? (
                    signedUp ? (
                      <div className="flex gap-2 mt-2">
                        <Badge variant="default" className="shrink-0">You're signed up</Badge>
                        <Button size="sm" variant="outline" className="flex-1" disabled={busy} onClick={() => handleCancel(opp)}>
                          {busy ? <Loader2 className="h-3 w-3 animate-spin" /> : "Cancel"}
                        </Button>
                      </div>
                    ) : (
                      <Button size="sm" className="w-full mt-2" disabled={busy || slotsLeft <= 0} onClick={() => handleSignup(opp)}>
                        {busy ? <Loader2 className="h-3 w-3 animate-spin" /> : "Sign Up"}
                      </Button>
                    )
                  ) : (
                    <Button size="sm" className="w-full mt-2" disabled>Sign Up (connect backend)</Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </PageWrapper>
    </DashboardLayout>
  );
}
