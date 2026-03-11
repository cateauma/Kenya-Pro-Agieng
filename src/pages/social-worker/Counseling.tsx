import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageWrapper } from "@/components/dashboard/PageWrapper";
import { DataTable, StatusBadge, Column } from "@/components/dashboard/DataTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface SessionRow {
  client: string;
  type: string;
  date: string;
  duration: string;
  status: string;
}

const sessions: SessionRow[] = [
  { client: "Group — Westlands", type: "Group Therapy", date: "Mar 11", duration: "1.5h", status: "Scheduled" },
  { client: "Mr. Kamau", type: "Individual", date: "Mar 11", duration: "1h", status: "Scheduled" },
  { client: "Mama Njeri", type: "Follow-up", date: "Mar 12", duration: "45m", status: "Scheduled" },
  { client: "Group — Eastlands", type: "Group Therapy", date: "Mar 10", duration: "2h", status: "Completed" },
  { client: "Mrs. Wambui", type: "Individual", date: "Mar 9", duration: "1h", status: "Completed" },
];

const columns: Column<SessionRow>[] = [
  { key: "client", label: "Client" },
  { key: "type", label: "Session Type" },
  { key: "date", label: "Date" },
  { key: "duration", label: "Duration" },
  { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
  { key: "actions", label: "", render: () => <Button variant="ghost" size="sm">Notes</Button> },
];

export default function Counseling() {
  return (
    <DashboardLayout>
      <PageWrapper
        title="Counseling Sessions"
        subtitle="Manage counseling and therapy sessions"
        actions={<Button><Plus className="mr-2 h-4 w-4" /> New Session</Button>}
      >
        <DataTable columns={columns} data={sessions} searchKey="client" searchPlaceholder="Search sessions..." />
      </PageWrapper>
    </DashboardLayout>
  );
}
