import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageWrapper } from "@/components/dashboard/PageWrapper";
import { DataTable, StatusBadge, Column } from "@/components/dashboard/DataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle } from "lucide-react";
import { fetchPendingProfiles, updateProfileStatus, profileRoleLabel } from "@/lib/api/profiles";
import { hasBackendConfig } from "@/lib/api/client";
import { format } from "date-fns";

interface ApprovalRow {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  submitted: string;
}

function toApprovalRow(p: { id: string; name: string; email: string; role: string; status: string; created_at: string }): ApprovalRow {
  return {
    id: p.id,
    name: p.name,
    email: p.email,
    role: profileRoleLabel(p.role),
    status: p.status,
    submitted: format(new Date(p.created_at), "MMM d, yyyy"),
  };
}

const MOCK_APPROVALS: ApprovalRow[] = [
  { id: "1", name: "John Omondi", email: "john@example.com", role: "Beneficiary", status: "Pending", submitted: "Mar 5, 2026" },
  { id: "2", name: "David Otieno", email: "david@example.com", role: "Healthcare Coordinator", status: "Pending", submitted: "Mar 8, 2026" },
];

export default function Approvals() {
  const queryClient = useQueryClient();
  const { data: pending, isLoading, error } = useQuery({
    queryKey: ["profiles", "pending"],
    queryFn: fetchPendingProfiles,
  });

  const updateStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: "approved" | "rejected" }) => updateProfileStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profiles"] });
      queryClient.invalidateQueries({ queryKey: ["profiles", "pending"] });
    },
  });

  const usingBackend = hasBackendConfig();
  const rows: ApprovalRow[] = pending?.map(toApprovalRow) ?? (usingBackend ? [] : MOCK_APPROVALS);

  const columns: Column<ApprovalRow>[] = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "role", label: "Role", render: (row) => <Badge variant="secondary" className="text-xs">{row.role}</Badge> },
    { key: "status", label: "Status", render: (row) => <StatusBadge status={row.status} /> },
    { key: "submitted", label: "Submitted" },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div className="flex gap-1">
          <Button
            size="sm"
            variant="outline"
            className="text-success border-success/30 hover:bg-success/10"
            disabled={updateStatus.isPending}
            onClick={() => updateStatus.mutate({ id: row.id, status: "approved" })}
          >
            <CheckCircle className="mr-1 h-3.5 w-3.5" /> Approve
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="text-destructive border-destructive/30 hover:bg-destructive/10"
            disabled={updateStatus.isPending}
            onClick={() => updateStatus.mutate({ id: row.id, status: "rejected" })}
          >
            <XCircle className="mr-1 h-3.5 w-3.5" /> Reject
          </Button>
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <PageWrapper title="Pending Approvals" subtitle="Review and approve new registrations">
        {error && <p className="text-destructive text-sm mb-4">{String(error)}</p>}
        {usingBackend && !error && pending && pending.length === 0 && (
          <p className="text-muted-foreground text-sm mb-4">No pending approvals. New sign-ups will appear here for you to approve.</p>
        )}
        <DataTable columns={columns} data={rows} searchKey="name" searchPlaceholder="Search pending..." />
      </PageWrapper>
    </DashboardLayout>
  );
}
