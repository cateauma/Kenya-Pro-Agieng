import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageWrapper } from "@/components/dashboard/PageWrapper";
import { DataTable, StatusBadge, Column } from "@/components/dashboard/DataTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface RecordRow {
  beneficiary: string;
  lastCheckup: string;
  bp: string;
  sugar: string;
  condition: string;
  status: string;
}

const records: RecordRow[] = [
  { beneficiary: "Mama Njeri", lastCheckup: "Mar 10", bp: "130/85", sugar: "Normal", condition: "Hypertension", status: "Active" },
  { beneficiary: "Mr. Kamau", lastCheckup: "Mar 8", bp: "120/80", sugar: "Normal", condition: "Diabetes Type 2", status: "Active" },
  { beneficiary: "Mrs. Wambui", lastCheckup: "Mar 5", bp: "140/90", sugar: "Elevated", condition: "Hypertension", status: "Active" },
  { beneficiary: "Mr. Otieno", lastCheckup: "Mar 7", bp: "118/75", sugar: "Normal", condition: "Arthritis", status: "Active" },
  { beneficiary: "Mama Akinyi", lastCheckup: "Feb 28", bp: "135/88", sugar: "High", condition: "Diabetes Type 2", status: "Overdue" },
];

const columns: Column<RecordRow>[] = [
  { key: "beneficiary", label: "Beneficiary" },
  { key: "lastCheckup", label: "Last Check-up" },
  { key: "bp", label: "Blood Pressure" },
  { key: "sugar", label: "Blood Sugar" },
  { key: "condition", label: "Condition" },
  { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
  { key: "actions", label: "", render: () => <Button variant="ghost" size="sm">View</Button> },
];

export default function HealthRecords() {
  return (
    <DashboardLayout>
      <PageWrapper
        title="Health Records"
        subtitle="Beneficiary health profiles and vitals"
        actions={<Button><Plus className="mr-2 h-4 w-4" /> New Record</Button>}
      >
        <DataTable columns={columns} data={records} searchKey="beneficiary" searchPlaceholder="Search records..." />
      </PageWrapper>
    </DashboardLayout>
  );
}
