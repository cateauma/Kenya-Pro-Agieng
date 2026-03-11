import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageWrapper } from "@/components/dashboard/PageWrapper";
import { DataTable, StatusBadge, Column } from "@/components/dashboard/DataTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface AssignmentRow {
  task: string;
  assignee: string;
  program: string;
  status: string;
  due: string;
}

const mockData: AssignmentRow[] = [
  { task: "Home visit — Westlands cluster", assignee: "Peter Kamau", program: "Health Monitoring", status: "Active", due: "Mar 12" },
  { task: "Meal delivery coordination", assignee: "Grace Muthoni", program: "Meal Distribution", status: "Active", due: "Mar 11" },
  { task: "Youth event planning", assignee: "Jane Wanjiku", program: "Intergenerational", status: "Scheduled", due: "Mar 18" },
  { task: "Financial literacy session", assignee: "Ann Wairimu", program: "Saccos & Chamas", status: "Completed", due: "Mar 8" },
  { task: "Counseling follow-ups", assignee: "Sarah Njeri", program: "Community Counseling", status: "Overdue", due: "Mar 5" },
];

const columns: Column<AssignmentRow>[] = [
  { key: "task", label: "Task" },
  { key: "assignee", label: "Assigned To" },
  { key: "program", label: "Program" },
  { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
  { key: "due", label: "Due Date" },
];

export default function Assignments() {
  return (
    <DashboardLayout>
      <PageWrapper
        title="Assignments"
        subtitle="Task assignments and scheduling"
        actions={<Button><Plus className="mr-2 h-4 w-4" /> Assign Task</Button>}
      >
        <DataTable columns={columns} data={mockData} searchKey="task" searchPlaceholder="Search tasks..." />
      </PageWrapper>
    </DashboardLayout>
  );
}
