import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageWrapper } from "@/components/dashboard/PageWrapper";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, User, Package, Check, X } from "lucide-react";
import { fetchAdminServiceRequests, approveServiceRequest, rejectServiceRequest, type AdminServiceRequest } from "@/lib/api/admin";
import { format } from "date-fns";
import { hasBackendConfig } from "@/lib/api/client";

export default function ServiceRequests() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<"pending" | "approved" | "rejected" | "">("");
  const [actingId, setActingId] = useState<string | null>(null);

  const { data: requests = [], isLoading, error } = useQuery({
    queryKey: ["admin", "service-requests", filter],
    queryFn: () => fetchAdminServiceRequests(filter || undefined),
    enabled: hasBackendConfig(),
  });

  const approveMutation = useMutation({
    mutationFn: approveServiceRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "service-requests"] });
    },
  });
  const rejectMutation = useMutation({
    mutationFn: rejectServiceRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "service-requests"] });
    },
  });

  const handleApprove = (id: string) => {
    setActingId(id);
    approveMutation.mutate(id, { onSettled: () => setActingId(null) });
  };
  const handleReject = (id: string) => {
    setActingId(id);
    rejectMutation.mutate(id, { onSettled: () => setActingId(null) });
  };

  if (!hasBackendConfig()) {
    return (
      <DashboardLayout>
        <PageWrapper title="Service requests" subtitle="Approve beneficiary service requests">
          <p className="text-muted-foreground text-sm">Connect the backend to view and approve requests.</p>
        </PageWrapper>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <PageWrapper title="Service requests" subtitle="Approve beneficiary service requests">
        <div className="flex flex-wrap gap-2 mb-4">
          {(["", "pending", "approved", "rejected"] as const).map((s) => (
            <Button
              key={s || "all"}
              variant={filter === s ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(s)}
            >
              {s === "" ? "All" : s === "pending" ? "Pending" : s === "approved" ? "Approved" : "Rejected"}
            </Button>
          ))}
        </div>
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        )}
        {error && (
          <p className="text-destructive text-sm">Failed to load requests. Please try again.</p>
        )}
        {!isLoading && !error && requests.length === 0 && (
          <p className="text-muted-foreground text-sm">No service requests match the selected filter.</p>
        )}
        {!isLoading && !error && requests.length > 0 && (
          <div className="space-y-3">
            {requests.map((r: AdminServiceRequest) => (
              <Card key={r.id} className="hover:shadow-sm transition-shadow">
                <CardContent className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{r.service_name}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <User className="h-3 w-3" />
                      {r.beneficiary_name} ({r.beneficiary_email})
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Requested {format(new Date(r.created_at), "MMM d, yyyy 'at' HH:mm")}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge
                      variant={
                        r.status === "approved" ? "default" : r.status === "rejected" ? "destructive" : "secondary"
                      }
                      className={
                        r.status === "approved" ? "bg-green-600" : ""
                      }
                    >
                      {r.status === "pending" ? "Pending" : r.status === "approved" ? "Approved" : "Rejected"}
                    </Badge>
                    {r.status === "pending" && (
                      <>
                        <Button
                          size="sm"
                          variant="default"
                          disabled={actingId === r.id}
                          onClick={() => handleApprove(r.id)}
                        >
                          {actingId === r.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-4 w-4" />}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={actingId === r.id}
                          onClick={() => handleReject(r.id)}
                        >
                          {actingId === r.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <X className="h-4 w-4" />}
                        </Button>
                      </>
                    )}
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
