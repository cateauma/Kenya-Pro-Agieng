import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/lib/roles";
import { NavLink } from "@/components/NavLink";
import {
  LayoutDashboard, Users, Heart, Calendar, FileText, HandCoins,
  Stethoscope, ClipboardList, Home, Bell, Wallet, Search, Settings, UserCheck,
} from "lucide-react";

interface NavItem {
  title: string;
  url: string;
  icon: React.ElementType;
}

const mobileNavItems: Record<UserRole, NavItem[]> = {
  admin: [
    { title: "Home", url: "/admin", icon: LayoutDashboard },
    { title: "Users", url: "/admin/users", icon: Users },
    { title: "Approvals", url: "/admin/approvals", icon: UserCheck },
    { title: "Signups", url: "/admin/signups", icon: Calendar },
    { title: "Services", url: "/admin/service-requests", icon: ClipboardList },
    { title: "Reports", url: "/admin/reports", icon: FileText },
    { title: "Settings", url: "/admin/settings", icon: Settings },
  ],
  program_manager: [
    { title: "Home", url: "/program-manager", icon: LayoutDashboard },
    { title: "Programs", url: "/program-manager/programs", icon: ClipboardList },
    { title: "Assign", url: "/program-manager/assignments", icon: Calendar },
    { title: "Reports", url: "/program-manager/reports", icon: FileText },
  ],
  social_worker: [
    { title: "Home", url: "/social-worker", icon: LayoutDashboard },
    { title: "Cases", url: "/social-worker/cases", icon: ClipboardList },
    { title: "Visits", url: "/social-worker/visits", icon: Home },
    { title: "Counsel", url: "/social-worker/counseling", icon: Heart },
  ],
  healthcare_coordinator: [
    { title: "Home", url: "/healthcare", icon: LayoutDashboard },
    { title: "Records", url: "/healthcare/records", icon: Stethoscope },
    { title: "Appts", url: "/healthcare/appointments", icon: Calendar },
    { title: "Search", url: "/search", icon: Search },
  ],
  finance_manager: [
    { title: "Home", url: "/finance", icon: LayoutDashboard },
    { title: "Donations", url: "/finance/donations", icon: HandCoins },
    { title: "Budget", url: "/finance/budget", icon: Wallet },
    { title: "Reports", url: "/finance/reports", icon: FileText },
  ],
  donor: [
    { title: "Home", url: "/donor", icon: LayoutDashboard },
    { title: "Donate", url: "/donor/donations", icon: HandCoins },
    { title: "Impact", url: "/donor/impact", icon: Heart },
    { title: "Search", url: "/search", icon: Search },
  ],
  beneficiary: [
    { title: "Home", url: "/beneficiary", icon: LayoutDashboard },
    { title: "Services", url: "/beneficiary/services", icon: Heart },
    { title: "Alerts", url: "/beneficiary/notifications", icon: Bell },
  ],
  caregiver: [
    { title: "Home", url: "/caregiver", icon: LayoutDashboard },
    { title: "Schedule", url: "/caregiver/schedule", icon: Calendar },
    { title: "People", url: "/caregiver/beneficiaries", icon: Users },
    { title: "Logs", url: "/caregiver/logs", icon: FileText },
  ],
  volunteer: [
    { title: "Home", url: "/volunteer", icon: LayoutDashboard },
    { title: "Browse", url: "/volunteer/opportunities", icon: Heart },
    { title: "Hours", url: "/volunteer/hours", icon: Calendar },
    { title: "Events", url: "/volunteer/events", icon: Users },
  ],
};

export function MobileBottomNav() {
  const { user } = useAuth();
  const role = user?.role || "admin";
  const items = mobileNavItems[role] || [];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border safe-area-bottom">
      <div className="flex items-center justify-around h-16">
        {items.map((item) => (
          <NavLink
            key={item.url}
            to={item.url}
            end={item.url === `/${role.replace("_", "-")}` || item.url === "/admin" || item.url === "/healthcare" || item.url === "/finance"}
            className="flex flex-col items-center justify-center gap-0.5 px-2 py-1.5 text-muted-foreground transition-colors min-w-0"
            activeClassName="text-primary"
          >
            <item.icon className="h-5 w-5" />
            <span className="text-[10px] font-medium truncate max-w-[60px]">{item.title}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
