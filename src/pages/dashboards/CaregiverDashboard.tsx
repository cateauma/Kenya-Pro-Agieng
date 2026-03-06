import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { ActivityList } from "@/components/dashboard/ActivityList";
import { Calendar, Users, FileText, Clock } from "lucide-react";

export default function CaregiverDashboard() {
  return (
    <DashboardLayout>
      <div className="page-header">
        <h1 className="page-title">Caregiver Dashboard</h1>
        <p className="page-subtitle">Manage your schedule and beneficiaries</p>
      </div>
      <div className="dashboard-grid mb-6">
        <StatCard title="Today's Visits" value={5} icon={Calendar} />
        <StatCard title="Assigned Beneficiaries" value={12} icon={Users} />
        <StatCard title="Logs This Week" value={18} icon={FileText} />
        <StatCard title="Hours This Week" value="32h" icon={Clock} />
      </div>
      <ActivityList title="Today's Schedule" activities={[
        { id: "1", text: "Morning check — Mama Wambui", time: "8:00 AM", type: "info" },
        { id: "2", text: "Meal delivery — Eastlands route", time: "10:00 AM", type: "info" },
        { id: "3", text: "Medication reminder — Mr. Otieno", time: "12:00 PM", type: "warning" },
        { id: "4", text: "Afternoon visit — Mrs. Njoroge", time: "2:00 PM", type: "info" },
        { id: "5", text: "End-of-day report submission", time: "5:00 PM", type: "info" },
      ]} />
    </DashboardLayout>
  );
}
