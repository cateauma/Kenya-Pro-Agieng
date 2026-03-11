import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageWrapper } from "@/components/dashboard/PageWrapper";
import { DataTable, StatusBadge, Column } from "@/components/dashboard/DataTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface LogRow {
  date: string;
  beneficiary: string;
  activity: string;
  duration: string;
  notes: string;
}

const logs: LogRow[] = [
  { date: "Mar 11", beneficiary: "Mama Wambui", activity: "Morning check", duration: "30m", notes: "BP normal, mood good" },
  { date: "Mar 11", beneficiary: "Mr. Otieno", activity: "Medication", duration: "15m", notes: "Reminded diabetes meds" },
  { date: "Mar 10", beneficiary: "Mrs. Njoroge", activity: "Home visit", duration: "1h", notes: "Mobility improving" },
  { date: "Mar 10", beneficiary: "Mama Njeri", activity: "Meal delivery", duration: "20m", notes: "Delivered lunch" },
  { date: "Mar 9", beneficiary: "Mr. Mwangi", activity: "Vital signs", duration: "25m", notes: "All readings normal" },
];

const columns: Column<LogRow>[] = [
  { key: "date", label: "Date" },
  { key: "beneficiary", label: "Beneficiary" },
  { key: "activity", label: "Activity" },
  { key: "duration", label: "Duration" },
  { key: "notes", label: "Notes" },
];

export default function CaregiverLogs() {
  return (
    <DashboardLayout>
      <PageWrapper
        title="Activity Logs"
        subtitle="Record and review daily interactions"
        actions={<Button><Plus className="mr-2 h-4 w-4" /> New Log</Button>}
      >
        <DataTable columns={columns} data={logs} searchKey="beneficiary" searchPlaceholder="Search logs..." />
      </PageWrapper>
    </DashboardLayout>
  );
}
