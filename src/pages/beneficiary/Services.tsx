import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageWrapper } from "@/components/dashboard/PageWrapper";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Utensils, Stethoscope, Home, Users, Wallet, Loader2, Clock, CheckCircle } from "lucide-react";
import {
  fetchServiceCatalog,
  fetchMyServiceRequests,
  requestService,
  type ServiceCatalogItem,
  type ServiceRequest,
} from "@/lib/api/beneficiary-services";
import { hasBackendConfig } from "@/lib/api/client";
import { format } from "date-fns";

const SERVICE_ICONS: Record<string, React.ElementType> = {
  meal_delivery: Utensils,
  health_monitoring: Stethoscope,
  home_visits: Home,
  counseling: Heart,
  community_activities: Users,
  financial_support: Wallet,
};

function ServiceIcon({ serviceId }: { serviceId: string }) {
  const Icon = SERVICE_ICONS[serviceId] ?? Heart;
  return (
    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
      <Icon className="h-5 w-5 text-primary" />
    </div>
  );
}

export default function Services() {
  const queryClient = useQueryClient();
  const [actingId, setActingId] = useState<string | null>(null);

  const { data: catalog = [], isLoading: catalogLoading } = useQuery({
    queryKey: ["beneficiary", "services", "catalog"],
    queryFn: fetchServiceCatalog,
    enabled: hasBackendConfig(),
  });

  const { data: requests = [], isLoading: requestsLoading } = useQuery({
    queryKey: ["beneficiary", "service-requests"],
    queryFn: fetchMyServiceRequests,
    enabled: hasBackendConfig(),
  });

  const requestMutation = useMutation({
    mutationFn: requestService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["beneficiary", "service-requests"] });
      queryClient.invalidateQueries({ queryKey: ["beneficiary", "services", "catalog"] });
    },
  });

  const requestedServiceIds = new Set(requests.map((r) => r.service_id));
  const pendingByService = new Map(requests.filter((r) => r.status === "pending").map((r) => [r.service_id, r]));

  const handleRequest = (serviceId: string) => {
    setActingId(serviceId);
    requestMutation.mutate(serviceId, { onSettled: () => setActingId(null) });
  };

  const pending = requests.filter((r) => r.status === "pending");
  const delivered = requests.filter((r) => r.status === "approved");

  const fallbackCatalog: ServiceCatalogItem[] = [
    { id: "meal_delivery", name: "Meal Delivery", description: "Nutritious meals delivered to your home twice a week", active: true },
    { id: "health_monitoring", name: "Health Monitoring", description: "Regular check-ups and vital sign tracking", active: true },
    { id: "home_visits", name: "Home Visits", description: "Social worker and caregiver home visits", active: true },
    { id: "counseling", name: "Counseling", description: "Emotional support and group therapy sessions", active: true },
    { id: "community_activities", name: "Community Activities", description: "Intergenerational events and social gatherings", active: false },
    { id: "financial_support", name: "Financial Support", description: "Linkage to saccos, chamas, and financial advice", active: false },
  ];
  const services = catalog.length ? catalog : (hasBackendConfig() ? [] : fallbackCatalog);

  return (
    <DashboardLayout>
      <PageWrapper title="Services" subtitle="Request and track services from KPAO">
        {/* Available services — request */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-3">Available services</h2>
          {(catalogLoading && hasBackendConfig()) && (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          )}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {!catalogLoading && services.map((s) => {
              const alreadyRequested = requestedServiceIds.has(s.id);
              const pendingReq = pendingByService.get(s.id);
              const busy = actingId === s.id;
              return (
                <Card key={s.id} className={`hover:shadow-md transition-shadow ${!s.active ? "opacity-60" : ""}`}>
                  <CardContent className="pt-6">
                    <ServiceIcon serviceId={s.id} />
                    <h3 className="font-heading font-semibold text-sm mb-1 mt-3">{s.name}</h3>
                    <p className="text-xs text-muted-foreground">{s.description}</p>
                    {hasBackendConfig() ? (
                      alreadyRequested ? (
                        <Badge variant="secondary" className="mt-3 text-xs">
                          {pendingReq ? "Pending approval" : "Requested"}
                        </Badge>
                      ) : (
                        <Button
                          size="sm"
                          className="w-full mt-3"
                          disabled={!s.active || busy}
                          onClick={() => handleRequest(s.id)}
                        >
                          {busy ? <Loader2 className="h-3 w-3 animate-spin" /> : "Request service"}
                        </Button>
                      )
                    ) : (
                      <p className="text-xs mt-2 font-medium text-muted-foreground">Connect backend to request</p>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Requested services — pending & delivered */}
        {hasBackendConfig() && (
          <section>
            <h2 className="text-lg font-semibold mb-3">Requested services</h2>
            {(requestsLoading) && (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            )}
            {!requestsLoading && requests.length === 0 && (
              <p className="text-sm text-muted-foreground">You haven’t requested any services yet. Use “Request service” above.</p>
            )}
            {!requestsLoading && requests.length > 0 && (
              <div className="space-y-4">
                {pending.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                      <Clock className="h-4 w-4" /> Pending
                    </h3>
                    <ul className="space-y-2">
                      {pending.map((r) => (
                        <Card key={r.id}>
                          <CardContent className="py-3 flex flex-row items-center justify-between">
                            <div className="flex items-center gap-3">
                              <ServiceIcon serviceId={r.service_id} />
                              <div>
                                <p className="font-medium text-sm">{r.service?.name ?? r.service_id}</p>
                                <p className="text-xs text-muted-foreground">Requested {format(new Date(r.created_at), "MMM d, yyyy")}</p>
                              </div>
                            </div>
                            <Badge variant="secondary">Pending approval</Badge>
                          </CardContent>
                        </Card>
                      ))}
                    </ul>
                  </div>
                )}
                {delivered.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" /> Delivered
                    </h3>
                    <ul className="space-y-2">
                      {delivered.map((r) => (
                        <Card key={r.id}>
                          <CardContent className="py-3 flex flex-row items-center justify-between">
                            <div className="flex items-center gap-3">
                              <ServiceIcon serviceId={r.service_id} />
                              <div>
                                <p className="font-medium text-sm">{r.service?.name ?? r.service_id}</p>
                                <p className="text-xs text-muted-foreground">Approved {r.reviewed_at ? format(new Date(r.reviewed_at), "MMM d, yyyy") : ""}</p>
                              </div>
                            </div>
                            <Badge variant="default" className="bg-green-600">Delivered</Badge>
                          </CardContent>
                        </Card>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </section>
        )}
      </PageWrapper>
    </DashboardLayout>
  );
}
