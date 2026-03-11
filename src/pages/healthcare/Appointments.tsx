import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageWrapper } from "@/components/dashboard/PageWrapper";
import { DataTable, StatusBadge, Column } from "@/components/dashboard/DataTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface ApptRow {
  beneficiary: string;
  type: string;
  doctor: string;
  date: string;
  time: string;
  status: string;
}

const appointments: ApptRow[] = [
  { beneficiary: "Mama Njeri", type: "Check-up", doctor: "Dr. Ochieng", date: "Mar 11", time: "10:00 AM", status: "Scheduled" },
  { beneficiary: "Mr. Kamau", type: "Follow-up", doctor: "Dr. Ochieng", date: "Mar 11", time: "11:30 AM", status: "Scheduled" },
  { beneficiary: "Mrs. Wambui", type: "Lab Test", doctor: "Lab Tech", date: "Mar 12", time: "9:00 AM", status: "Scheduled" },
  { beneficiary: "Mr. Otieno", type: "Check-up", doctor: "Dr. Wanjiru", date: "Mar 10", time: "2:00 PM", status: "Completed" },
  { beneficiary: "Mama Akinyi", type: "Urgent", doctor: "Dr. Ochieng", date: "Mar 10", time: "3:30 PM", status: "Completed" },
];

const columns: Column<ApptRow>[] = [
  { key: "beneficiary", label: "Beneficiary" },
  { key: "type", label: "Type" },
  { key: "doctor", label: "Provider" },
  { key: "date", label: "Date" },
  { key: "time", label: "Time" },
  { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
];

export default function Appointments() {
  return (
    <DashboardLayout>
      <PageWrapper
        title="Appointments"
        subtitle="Schedule and manage health appointments"
        actions={<Button><Plus className="mr-2 h-4 w-4" /> Book Appointment</Button>}
      >
        <DataTable columns={columns} data={appointments} searchKey="beneficiary" searchPlaceholder="Search appointments..." />
      </PageWrapper>
    </DashboardLayout>
  );
}
