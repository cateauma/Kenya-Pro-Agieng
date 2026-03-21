import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageWrapper } from "@/components/dashboard/PageWrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/dashboard/DataTable";
import { Plus, Users, Calendar, Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { hasBackendConfig } from "@/lib/api/client";
import { fetchPrograms, createProgram, type Program } from "@/lib/api/programs";

export default function Programs() {
  const queryClient = useQueryClient();
  const [openNew, setOpenNew] = useState(false);
  const [selected, setSelected] = useState<Program | null>(null);
  const [name, setName] = useState("");
  const [region, setRegion] = useState("");
  const [description, setDescription] = useState("");
  const [goals, setGoals] = useState("");

  const { data: programs = [], isLoading } = useQuery({
    queryKey: ["programs"],
    queryFn: fetchPrograms,
    enabled: hasBackendConfig(),
  });

  const createMutation = useMutation({
    mutationFn: createProgram,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["programs"] });
      setOpenNew(false);
      setName("");
      setRegion("");
      setDescription("");
      setGoals("");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    createMutation.mutate({
      name,
      region: region || "Nairobi",
      description,
      goals,
    });
  };

  const list: Program[] =
    hasBackendConfig() && programs.length
      ? programs
      : [
          {
            id: "demo-1",
            name: "Meal Distribution Program",
            description: "Ensuring older persons receive regular nutritious meals.",
            region: "Nairobi",
            status: "Active",
            start_date: "2026-01-01",
            end_date: null,
            budget: 0,
            goals: "Reduce food insecurity for older persons.",
            beneficiaries_count: 85,
            progress: 95,
            created_at: new Date().toISOString(),
          },
        ];

  return (
    <DashboardLayout>
      <PageWrapper
        title="Programs"
        subtitle="Manage and monitor all programs"
        actions={
          <Button onClick={() => setOpenNew(true)} disabled={!hasBackendConfig()}>
            <Plus className="mr-2 h-4 w-4" /> New Program
          </Button>
        }
      >
        {isLoading && hasBackendConfig() && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        )}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((p) => (
            <Card key={p.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-sm font-heading">{p.name}</CardTitle>
                  <StatusBadge status={p.status} />
                </div>
                <Badge variant="outline" className="w-fit text-xs">
                  {p.region}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-3.5 w-3.5" />
                  <span>{p.beneficiaries_count ?? 0} beneficiaries</span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{p.progress ?? 0}%</span>
                  </div>
                  <Progress value={p.progress ?? 0} className="h-2" />
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {p.start_date || "Start TBC"}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-2"
                  onClick={() => setSelected(p)}
                >
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* New Program dialog */}
        <Dialog open={openNew} onOpenChange={setOpenNew}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New Program</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Name</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div>
                <Label>Region</Label>
                <Input
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  placeholder="e.g. Nairobi, Kisumu"
                />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>
              <div>
                <Label>Goals</Label>
                <Textarea
                  value={goals}
                  onChange={(e) => setGoals(e.target.value)}
                  rows={3}
                  placeholder="What is this program trying to achieve?"
                />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setOpenNew(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createMutation.isLoading}>
                  {createMutation.isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Create Program"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* View Details dialog */}
        <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selected?.name ?? "Program details"}</DialogTitle>
            </DialogHeader>
            {selected && (
              <div className="space-y-3 text-sm">
                <p className="text-muted-foreground">{selected.description || "No description yet."}</p>
                <div className="flex flex-wrap gap-2 text-xs">
                  <Badge variant="outline">{selected.region}</Badge>
                  <Badge>{selected.status}</Badge>
                </div>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>Start date: {selected.start_date || "Not set"}</p>
                  <p>End date: {selected.end_date || "Not set"}</p>
                  <p>Beneficiaries: {selected.beneficiaries_count ?? 0}</p>
                </div>
                {selected.goals && (
                  <div>
                    <p className="font-medium text-xs mb-1">Goals</p>
                    <p className="text-xs text-muted-foreground whitespace-pre-line">{selected.goals}</p>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </PageWrapper>
    </DashboardLayout>
  );
}
