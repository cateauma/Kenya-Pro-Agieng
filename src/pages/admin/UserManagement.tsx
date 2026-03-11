import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageWrapper } from "@/components/dashboard/PageWrapper";
import { DataTable, StatusBadge, Column } from "@/components/dashboard/DataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserPlus } from "lucide-react";

interface UserRow {
  name: string;
  email: string;
  role: string;
  status: string;
  joined: string;
}

const mockUsers: UserRow[] = [
  { name: "Jane Wanjiku", email: "jane@example.com", role: "Volunteer", status: "Active", joined: "Mar 1, 2026" },
  { name: "John Omondi", email: "john@example.com", role: "Beneficiary", status: "Pending", joined: "Mar 5, 2026" },
  { name: "Mary Akinyi", email: "mary@example.com", role: "Donor", status: "Active", joined: "Feb 20, 2026" },
  { name: "Grace Muthoni", email: "grace@example.com", role: "Caregiver", status: "Active", joined: "Jan 15, 2026" },
  { name: "Peter Kamau", email: "peter@example.com", role: "Social Worker", status: "Active", joined: "Dec 10, 2025" },
  { name: "Sarah Njeri", email: "sarah@example.com", role: "Program Manager", status: "Active", joined: "Nov 5, 2025" },
  { name: "David Otieno", email: "david@example.com", role: "Healthcare Coordinator", status: "Pending", joined: "Mar 8, 2026" },
  { name: "Ann Wairimu", email: "ann@example.com", role: "Finance Manager", status: "Active", joined: "Oct 1, 2025" },
];

const columns: Column<UserRow>[] = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "role", label: "Role", render: (row) => <Badge variant="secondary" className="text-xs">{row.role}</Badge> },
  { key: "status", label: "Status", render: (row) => <StatusBadge status={row.status} /> },
  { key: "joined", label: "Joined" },
  {
    key: "actions", label: "Actions", render: () => (
      <div className="flex gap-1">
        <Button variant="ghost" size="sm">Edit</Button>
        <Button variant="ghost" size="sm" className="text-destructive">Remove</Button>
      </div>
    ),
  },
];

export default function UserManagement() {
  return (
    <DashboardLayout>
      <PageWrapper
        title="User Management"
        subtitle="Manage all system users and roles"
        actions={<Button><UserPlus className="mr-2 h-4 w-4" /> Add User</Button>}
      >
        <DataTable columns={columns} data={mockUsers} searchKey="name" searchPlaceholder="Search users..." />
      </PageWrapper>
    </DashboardLayout>
  );
}
