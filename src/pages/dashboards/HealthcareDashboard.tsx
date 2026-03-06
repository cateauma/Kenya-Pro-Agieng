import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { ActivityList } from "@/components/dashboard/ActivityList";
import { Stethoscope, Calendar, Heart, AlertTriangle } from "lucide-react";

export default function HealthcareDashboard() {
  return (
    <DashboardLayout>
      <div className="page-header">
        <h1 className="page-title">Healthcare Coordinator</h1>
        <p className="page-subtitle">Health monitoring and appointments</p>
      </div>
      <div className="dashboard-grid mb-6">
        <StatCard title="Health Records" value={142} icon={Stethoscope} />
        <StatCard title="Appointments Today" value={8} icon={Calendar} />
        <StatCard title="Vitals Logged" value={56} icon={Heart} trend="This week" />
        <StatCard title="Urgent Alerts" value={2} icon={AlertTriangle} />
      </div>
      <ActivityList title="Recent Health Updates" activities={[
        { id: "1", text: "Blood pressure check completed — Beneficiary #089", time: "1 hour ago", type: "success" },
        { id: "2", text: "Urgent: Elevated blood sugar — Beneficiary #034", time: "3 hours ago", type: "warning" },
        { id: "3", text: "Monthly check-up scheduled for 12 beneficiaries", time: "Yesterday", type: "info" },
      ]} />
    </DashboardLayout>
  );
}
