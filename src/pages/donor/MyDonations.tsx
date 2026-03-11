import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageWrapper } from "@/components/dashboard/PageWrapper";
import { DataTable, StatusBadge, Column } from "@/components/dashboard/DataTable";
import { Button } from "@/components/ui/button";
import { HandCoins } from "lucide-react";

interface DonationRow {
  date: string;
  amount: string;
  type: string;
  program: string;
  status: string;
}

const donations: DonationRow[] = [
  { date: "Mar 1, 2026", amount: "KES 10,000", type: "Monthly", program: "General Fund", status: "Completed" },
  { date: "Feb 15, 2026", amount: "20 items", type: "In-Kind", program: "Clothing Drive", status: "Completed" },
  { date: "Feb 1, 2026", amount: "KES 10,000", type: "Monthly", program: "General Fund", status: "Completed" },
  { date: "Jan 1, 2026", amount: "KES 10,000", type: "Monthly", program: "General Fund", status: "Completed" },
  { date: "Dec 20, 2025", amount: "KES 25,000", type: "One-time", program: "Holiday Meals", status: "Completed" },
  { date: "Dec 1, 2025", amount: "KES 10,000", type: "Monthly", program: "General Fund", status: "Completed" },
];

const columns: Column<DonationRow>[] = [
  { key: "date", label: "Date" },
  { key: "amount", label: "Amount" },
  { key: "type", label: "Type" },
  { key: "program", label: "Program" },
  { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
];

export default function MyDonations() {
  return (
    <DashboardLayout>
      <PageWrapper
        title="My Donations"
        subtitle="Your donation history"
        actions={<Button><HandCoins className="mr-2 h-4 w-4" /> Make Donation</Button>}
      >
        <DataTable columns={columns} data={donations} searchKey="program" searchPlaceholder="Search donations..." />
      </PageWrapper>
    </DashboardLayout>
  );
}
