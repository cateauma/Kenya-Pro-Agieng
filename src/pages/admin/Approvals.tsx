import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageWrapper } from "@/components/dashboard/PageWrapper";
import { DataTable, StatusBadge, Column } from "@/components/dashboard/DataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle } from "lucide-react";

interface ApprovalRow {
  name: string;
  email: string;
  role: string;
  status: string;
  submitted: string;
}

const mockApprovals: ApprovalRow[] = [
  { name: "John Omondi", email: "john@example.com", role: "Beneficiary", status: "Pending", submitted: "Mar 5, 2026" },
  { name: "David Otieno", email: "david@example.com", role: "Healthcare Coordinator", status: "Pending", submitted: "Mar 8, 2026" },
  { name: "Lucy Wambui", email: "lucy@example.com", role: "Volunteer", status: "Pending", submitted: "Mar 9, 2026" },
  { name: "Tom Maina", email: "tom@example.com", role: "Donor", status: "Pending", submitted: "Mar 10, 2026" },
  { name: "Faith Njoki", email: "faith@example.com", role: "Caregiver", status: "Pending", submitted: "Mar 10, 2026" },
];

const columns: Column<ApprovalRow>[] = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "role", label: "Role", render: (row) => <Badge variant="secondary" className="text-xs">{row.role}</Badge> },
  { key: "status", label: "Status", render: (row) => <StatusBadge status={row.status} /> },
  { key: "submitted", label: "Submitted" },
  {
    key: "actions", label: "Actions", render: () => (
      <div className="flex gap-1">
        <Button size="sm" variant="outline" className="text-success border-success/30 hover:bg-success/10">
          <CheckCircle className="mr-1 h-3.5 w-3.5" /> Approve
        </Button>
        <Button size="sm" variant="outline" className="text-destructive border-destructive/30 hover:bg-destructive/10">
          <XCircle className="mr-1 h-3.5 w-3.5" /> Reject
        </Button>
      </div>
    ),
  },
];

export default function Approvals() {
  return (
    <DashboardLayout>
      <PageWrapper title="Pending Approvals" subtitle="Review and approve new registrations">
        <DataTable columns={columns} data={mockApprovals} searchKey="name" searchPlaceholder="Search pending..." />
      </PageWrapper>
    </DashboardLayout>
  );
}
