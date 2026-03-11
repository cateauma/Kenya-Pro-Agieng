import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageWrapper } from "@/components/dashboard/PageWrapper";
import { DataTable, StatusBadge, Column } from "@/components/dashboard/DataTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface CaseRow {
  beneficiary: string;
  type: string;
  priority: string;
  status: string;
  lastUpdate: string;
}

const mockCases: CaseRow[] = [
  { beneficiary: "Mama Njeri", type: "Home Assessment", priority: "High", status: "Active", lastUpdate: "Today" },
  { beneficiary: "Mr. Kamau", type: "Counseling", priority: "Medium", status: "Active", lastUpdate: "Yesterday" },
  { beneficiary: "Mrs. Wambui", type: "Financial Linkage", priority: "Low", status: "Scheduled", lastUpdate: "Mar 8" },
  { beneficiary: "Mr. Otieno", type: "Health Follow-up", priority: "High", status: "Overdue", lastUpdate: "Mar 3" },
  { beneficiary: "Mama Akinyi", type: "Meal Coordination", priority: "Medium", status: "Completed", lastUpdate: "Mar 7" },
];

const columns: Column<CaseRow>[] = [
  { key: "beneficiary", label: "Beneficiary" },
  { key: "type", label: "Case Type" },
  { key: "priority", label: "Priority", render: (r) => <StatusBadge status={r.priority === "High" ? "overdue" : r.priority === "Medium" ? "pending" : "active"} /> },
  { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
  { key: "lastUpdate", label: "Last Update" },
  { key: "actions", label: "", render: () => <Button variant="ghost" size="sm">View</Button> },
];

export default function Cases() {
  return (
    <DashboardLayout>
      <PageWrapper
        title="Case Management"
        subtitle="Track and manage beneficiary cases"
        actions={<Button><Plus className="mr-2 h-4 w-4" /> New Case</Button>}
      >
        <DataTable columns={columns} data={mockCases} searchKey="beneficiary" searchPlaceholder="Search cases..." />
      </PageWrapper>
    </DashboardLayout>
  );
}
