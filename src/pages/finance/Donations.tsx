import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageWrapper } from "@/components/dashboard/PageWrapper";
import { DataTable, StatusBadge, Column } from "@/components/dashboard/DataTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface DonationRow {
  donor: string;
  amount: string;
  type: string;
  date: string;
  status: string;
}

const donations: DonationRow[] = [
  { donor: "Safaricom Foundation", amount: "KES 500,000", type: "Corporate", date: "Mar 10", status: "Active" },
  { donor: "Mary Akinyi", amount: "KES 10,000", type: "Individual", date: "Mar 1", status: "Active" },
  { donor: "Red Cross Kenya", amount: "KES 250,000", type: "Partner NGO", date: "Feb 28", status: "Active" },
  { donor: "Tom Maina", amount: "KES 5,000", type: "Individual", date: "Feb 25", status: "Active" },
  { donor: "USAID Grant", amount: "KES 1,200,000", type: "Grant", date: "Feb 15", status: "Active" },
];

const columns: Column<DonationRow>[] = [
  { key: "donor", label: "Donor" },
  { key: "amount", label: "Amount" },
  { key: "type", label: "Type" },
  { key: "date", label: "Date" },
  { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
  { key: "actions", label: "", render: () => <Button variant="ghost" size="sm">Receipt</Button> },
];

export default function Donations() {
  return (
    <DashboardLayout>
      <PageWrapper
        title="Donations"
        subtitle="Track all incoming donations"
        actions={<Button><Plus className="mr-2 h-4 w-4" /> Record Donation</Button>}
      >
        <DataTable columns={columns} data={donations} searchKey="donor" searchPlaceholder="Search donations..." />
      </PageWrapper>
    </DashboardLayout>
  );
}
