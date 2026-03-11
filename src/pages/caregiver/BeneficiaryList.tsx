import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageWrapper } from "@/components/dashboard/PageWrapper";
import { DataTable, StatusBadge, Column } from "@/components/dashboard/DataTable";
import { Button } from "@/components/ui/button";

interface BeneficiaryRow {
  name: string;
  age: number;
  location: string;
  condition: string;
  lastVisit: string;
  status: string;
}

const beneficiaries: BeneficiaryRow[] = [
  { name: "Mama Wambui", age: 78, location: "Westlands", condition: "Hypertension", lastVisit: "Today", status: "Active" },
  { name: "Mr. Otieno", age: 82, location: "Kibera", condition: "Diabetes", lastVisit: "Yesterday", status: "Active" },
  { name: "Mrs. Njoroge", age: 71, location: "Karen", condition: "Arthritis", lastVisit: "Mar 9", status: "Active" },
  { name: "Mama Njeri", age: 76, location: "Langata", condition: "Heart condition", lastVisit: "Mar 8", status: "Active" },
  { name: "Mr. Mwangi", age: 85, location: "Dagoretti", condition: "General elderly care", lastVisit: "Mar 7", status: "Active" },
];

const columns: Column<BeneficiaryRow>[] = [
  { key: "name", label: "Name" },
  { key: "age", label: "Age" },
  { key: "location", label: "Location" },
  { key: "condition", label: "Condition" },
  { key: "lastVisit", label: "Last Visit" },
  { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
  { key: "actions", label: "", render: () => <Button variant="ghost" size="sm">View</Button> },
];

export default function BeneficiaryList() {
  return (
    <DashboardLayout>
      <PageWrapper title="My Beneficiaries" subtitle="People under your care">
        <DataTable columns={columns} data={beneficiaries} searchKey="name" searchPlaceholder="Search beneficiaries..." />
      </PageWrapper>
    </DashboardLayout>
  );
}
