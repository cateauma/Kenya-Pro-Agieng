import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageWrapper } from "@/components/dashboard/PageWrapper";
import { DataTable, StatusBadge, Column } from "@/components/dashboard/DataTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface VisitRow {
  beneficiary: string;
  location: string;
  date: string;
  time: string;
  status: string;
}

const visits: VisitRow[] = [
  { beneficiary: "Mama Njeri", location: "Westlands", date: "Mar 11", time: "9:00 AM", status: "Scheduled" },
  { beneficiary: "Mr. Kamau", location: "Eastlands", date: "Mar 11", time: "2:00 PM", status: "Scheduled" },
  { beneficiary: "Mrs. Wambui", location: "Karen", date: "Mar 12", time: "10:00 AM", status: "Scheduled" },
  { beneficiary: "Mr. Otieno", location: "Kibera", date: "Mar 10", time: "11:00 AM", status: "Completed" },
  { beneficiary: "Mama Akinyi", location: "Langata", date: "Mar 9", time: "3:00 PM", status: "Completed" },
];

const columns: Column<VisitRow>[] = [
  { key: "beneficiary", label: "Beneficiary" },
  { key: "location", label: "Location" },
  { key: "date", label: "Date" },
  { key: "time", label: "Time" },
  { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
  { key: "actions", label: "", render: () => <Button variant="ghost" size="sm">Details</Button> },
];

export default function HomeVisits() {
  return (
    <DashboardLayout>
      <PageWrapper
        title="Home Visits"
        subtitle="Schedule and track home visits"
        actions={<Button><Plus className="mr-2 h-4 w-4" /> Schedule Visit</Button>}
      >
        <DataTable columns={columns} data={visits} searchKey="beneficiary" searchPlaceholder="Search visits..." />
      </PageWrapper>
    </DashboardLayout>
  );
}
