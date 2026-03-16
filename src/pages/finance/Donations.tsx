import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageWrapper } from "@/components/dashboard/PageWrapper";
import { DataTable, StatusBadge, Column } from "@/components/dashboard/DataTable";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { fetchDonations, createDonation } from "@/lib/api/donations";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";

interface DonationDisplayRow {
  id: string;
  donor: string;
  amount: string;
  type: string;
  date: string;
  status: string;
}

const DONATION_TYPES = ["Corporate", "Individual", "Partner NGO", "Grant", "Other"];

const MOCK_DONATIONS: DonationDisplayRow[] = [
  { id: "1", donor: "Safaricom Foundation", amount: "KES 500,000", type: "Corporate", date: "Mar 10", status: "Active" },
  { id: "2", donor: "Mary Akinyi", amount: "KES 10,000", type: "Individual", date: "Mar 1", status: "Active" },
];

function formatAmount(cents: number, currency: string): string {
  const n = cents / 100;
  return `${currency} ${n.toLocaleString()}`;
}

export default function Donations() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [donorName, setDonorName] = useState("");
  const [amountKes, setAmountKes] = useState("");
  const [type, setType] = useState("");

  const { data: donations, error } = useQuery({
    queryKey: ["donations"],
    queryFn: fetchDonations,
  });

  const createMutation = useMutation({
    mutationFn: () =>
      createDonation(
        {
          donor_name: donorName,
          amount_cents: Math.round(parseFloat(amountKes || "0") * 100),
          currency: "KES",
          type: type || "Other",
        },
        user?.id
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["donations"] });
      setOpen(false);
      setDonorName("");
      setAmountKes("");
      setType("");
    },
  });

  const rows: DonationDisplayRow[] =
    donations?.map((d) => ({
      id: d.id,
      donor: d.donor_name,
      amount: formatAmount(d.amount_cents, d.currency),
      type: d.type,
      date: format(new Date(d.created_at), "MMM d"),
      status: d.status,
    })) ?? MOCK_DONATIONS;

  const columns: Column<DonationDisplayRow>[] = [
    { key: "donor", label: "Donor" },
    { key: "amount", label: "Amount" },
    { key: "type", label: "Type" },
    { key: "date", label: "Date" },
    { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
    { key: "actions", label: "", render: () => <Button variant="ghost" size="sm">Receipt</Button> },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!donorName.trim() || !amountKes || parseFloat(amountKes) <= 0) return;
    createMutation.mutate();
  };

  return (
    <DashboardLayout>
      <PageWrapper
        title="Donations"
        subtitle="Track all incoming donations"
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="mr-2 h-4 w-4" /> Record Donation</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Record donation</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label>Donor name</Label>
                  <Input
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    placeholder="e.g. Safaricom Foundation"
                    required
                  />
                </div>
                <div>
                  <Label>Amount (KES)</Label>
                  <Input
                    type="number"
                    min="1"
                    step="1"
                    value={amountKes}
                    onChange={(e) => setAmountKes(e.target.value)}
                    placeholder="10000"
                    required
                  />
                </div>
                <div>
                  <Label>Type</Label>
                  <Select value={type} onValueChange={setType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {DONATION_TYPES.map((t) => (
                        <SelectItem key={t} value={t}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={createMutation.isPending}>
                    {createMutation.isPending ? "Saving..." : "Save"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        }
      >
        {error && <p className="text-destructive text-sm mb-4">{String(error)}</p>}
        {createMutation.isError && <p className="text-destructive text-sm mb-4">{String(createMutation.error)}</p>}
        <DataTable columns={columns} data={rows} searchKey="donor" searchPlaceholder="Search donations..." />
      </PageWrapper>
    </DashboardLayout>
  );
}
