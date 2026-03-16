import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageWrapper } from "@/components/dashboard/PageWrapper";
import { DataTable, StatusBadge, Column } from "@/components/dashboard/DataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserPlus } from "lucide-react";
import { fetchProfiles, profileRoleLabel } from "@/lib/api/profiles";
import { hasBackendConfig } from "@/lib/api/client";
import { createUserInBackend } from "@/lib/api/admin";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { ROLE_CONFIGS, UserRole } from "@/lib/roles";
import { format } from "date-fns";

interface UserRow {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  joined: string;
}

function toUserRow(p: { id: string; name: string; email: string; role: string; status: string; created_at: string }): UserRow {
  return {
    id: p.id,
    name: p.name,
    email: p.email,
    role: profileRoleLabel(p.role),
    status: p.status === "approved" ? "Active" : p.status,
    joined: format(new Date(p.created_at), "MMM d, yyyy"),
  };
}

const MOCK_USERS: UserRow[] = [
  { id: "1", name: "Jane Wanjiku", email: "jane@example.com", role: "Volunteer", status: "Active", joined: "Mar 1, 2026" },
  { id: "2", name: "John Omondi", email: "john@example.com", role: "Beneficiary", status: "Pending", joined: "Mar 5, 2026" },
  { id: "3", name: "Mary Akinyi", email: "mary@example.com", role: "Donor", status: "Active", joined: "Feb 20, 2026" },
];

export default function UserManagement() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState<UserRole>("volunteer");
  const [formError, setFormError] = useState("");

  const { data: profiles, isLoading, error } = useQuery({
    queryKey: ["profiles"],
    queryFn: fetchProfiles,
  });

  const usingBackend = hasBackendConfig();
  const createMutation = useMutation({
    mutationFn: () =>
      createUserInBackend({
        email: newEmail,
        password: newPassword,
        full_name: newName,
        phone_number: newPhone,
        role: newRole,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profiles"] });
      setOpen(false);
      setNewName("");
      setNewEmail("");
      setNewPhone("");
      setNewPassword("");
      setFormError("");
    },
    onError: (err: unknown) => {
      setFormError(err instanceof Error ? err.message : "Failed to create user");
    },
  });

  const rows: UserRow[] = profiles?.map(toUserRow) ?? (usingBackend ? [] : MOCK_USERS);
  const columns: Column<UserRow>[] = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "role", label: "Role", render: (row) => <Badge variant="secondary" className="text-xs">{row.role}</Badge> },
    { key: "status", label: "Status", render: (row) => <StatusBadge status={row.status} /> },
    { key: "joined", label: "Joined" },
    {
      key: "actions",
      label: "Actions",
      render: () => (
        <div className="flex gap-1">
          <Button variant="ghost" size="sm">Edit</Button>
          <Button variant="ghost" size="sm" className="text-destructive">Remove</Button>
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <PageWrapper
        title="User Management"
        subtitle="Manage all system users and roles"
        actions={
          usingBackend ? (
            <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setFormError(""); }}>
              <DialogTrigger asChild>
                <Button><UserPlus className="mr-2 h-4 w-4" /> Add User</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add user</DialogTitle>
                </DialogHeader>
                <form
                  className="space-y-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!newName || !newEmail || !newPassword || !newPhone) {
                      setFormError("Name, email, phone, and password are required.");
                      return;
                    }
                    createMutation.mutate();
                  }}
                >
                  {formError && <p className="text-destructive text-sm">{formError}</p>}
                  <div>
                    <Label>Name</Label>
                    <Input value={newName} onChange={(e) => setNewName(e.target.value)} required />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} required />
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <Input value={newPhone} onChange={(e) => setNewPhone(e.target.value)} required />
                  </div>
                  <div>
                    <Label>Temporary password</Label>
                    <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
                  </div>
                  <div>
                    <Label>Role</Label>
                    <Select value={newRole} onValueChange={(v) => setNewRole(v as UserRole)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        {(Object.keys(ROLE_CONFIGS) as UserRole[]).map((r) => (
                          <SelectItem key={r} value={r}>
                            {ROLE_CONFIGS[r].label}
                          </SelectItem>
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
          ) : (
            <Button disabled title="Backend required to add users"> 
              <UserPlus className="mr-2 h-4 w-4" /> Add User
            </Button>
          )
        }
      >
        {error && <p className="text-destructive text-sm mb-4">{String(error)}</p>}
        {usingBackend && !error && profiles && profiles.length === 0 && (
          <p className="text-muted-foreground text-sm mb-4">No users yet. Sign up from the Register page or log in as admin (admin@gmail.com / 12345678) to see the seeded admin user here.</p>
        )}
        <DataTable columns={columns} data={rows} searchKey="name" searchPlaceholder="Search users..." />
      </PageWrapper>
    </DashboardLayout>
  );
}
