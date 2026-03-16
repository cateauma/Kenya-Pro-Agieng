import {
  LayoutDashboard,
  Users,
  Heart,
  Calendar,
  FileText,
  Settings,
  HelpCircle,
  Info,
  MessageSquare,
  Search,
  LogOut,
  HandCoins,
  Stethoscope,
  UserCheck,
  ClipboardList,
  Home,
  Bell,
  Wallet,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ROLE_CONFIGS, UserRole } from "@/lib/roles";
import logo from "@/assets/logo.png";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

interface NavItem {
  title: string;
  url: string;
  icon: React.ElementType;
}

const roleNavItems: Record<UserRole, NavItem[]> = {
  admin: [
    { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
    { title: "User Management", url: "/admin/users", icon: Users },
    { title: "Approvals", url: "/admin/approvals", icon: UserCheck },
    { title: "Event signups", url: "/admin/signups", icon: Calendar },
    { title: "Service requests", url: "/admin/service-requests", icon: ClipboardList },
    { title: "Reports", url: "/admin/reports", icon: FileText },
    { title: "Settings", url: "/admin/settings", icon: Settings },
  ],
  program_manager: [
    { title: "Dashboard", url: "/program-manager", icon: LayoutDashboard },
    { title: "Programs", url: "/program-manager/programs", icon: ClipboardList },
    { title: "Assignments", url: "/program-manager/assignments", icon: Calendar },
    { title: "Reports", url: "/program-manager/reports", icon: FileText },
  ],
  social_worker: [
    { title: "Dashboard", url: "/social-worker", icon: LayoutDashboard },
    { title: "Cases", url: "/social-worker/cases", icon: ClipboardList },
    { title: "Home Visits", url: "/social-worker/visits", icon: Home },
    { title: "Counseling", url: "/social-worker/counseling", icon: Heart },
  ],
  healthcare_coordinator: [
    { title: "Dashboard", url: "/healthcare", icon: LayoutDashboard },
    { title: "Health Records", url: "/healthcare/records", icon: Stethoscope },
    { title: "Appointments", url: "/healthcare/appointments", icon: Calendar },
  ],
  finance_manager: [
    { title: "Dashboard", url: "/finance", icon: LayoutDashboard },
    { title: "Donations", url: "/finance/donations", icon: HandCoins },
    { title: "Budget", url: "/finance/budget", icon: Wallet },
    { title: "Reports", url: "/finance/reports", icon: FileText },
  ],
  donor: [
    { title: "Dashboard", url: "/donor", icon: LayoutDashboard },
    { title: "My Donations", url: "/donor/donations", icon: HandCoins },
    { title: "Impact Reports", url: "/donor/impact", icon: Heart },
  ],
  beneficiary: [
    { title: "Dashboard", url: "/beneficiary", icon: LayoutDashboard },
    { title: "Services", url: "/beneficiary/services", icon: Heart },
    { title: "Notifications", url: "/beneficiary/notifications", icon: Bell },
  ],
  caregiver: [
    { title: "Dashboard", url: "/caregiver", icon: LayoutDashboard },
    { title: "Schedule", url: "/caregiver/schedule", icon: Calendar },
    { title: "Beneficiaries", url: "/caregiver/beneficiaries", icon: Users },
    { title: "Logs", url: "/caregiver/logs", icon: FileText },
  ],
  volunteer: [
    { title: "Dashboard", url: "/volunteer", icon: LayoutDashboard },
    { title: "Opportunities", url: "/volunteer/opportunities", icon: Heart },
    { title: "My Hours", url: "/volunteer/hours", icon: Calendar },
    { title: "Events", url: "/volunteer/events", icon: Users },
  ],
};

const commonNavItems: NavItem[] = [
  { title: "Search", url: "/search", icon: Search },
  { title: "About Us", url: "/about", icon: Info },
  { title: "Contact Us", url: "/contact", icon: MessageSquare },
  { title: "Help", url: "/help", icon: HelpCircle },
  { title: "Feedback", url: "/feedback", icon: MessageSquare },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const role = user?.role || "admin";
  const items = roleNavItems[role] || [];

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <div className="p-4 flex items-center gap-3">
          <img src={logo} alt="KPAO Logo" className="w-10 h-10 rounded-lg object-contain" />
          {!collapsed && (
            <div>
              <p className="font-heading font-bold text-sm text-sidebar-foreground">KPAO</p>
              <p className="text-xs text-sidebar-foreground/60">{ROLE_CONFIGS[role].label}</p>
            </div>
          )}
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end className="hover:bg-sidebar-accent/50" activeClassName="bg-sidebar-accent text-sidebar-primary font-medium">
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>General</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {commonNavItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className="hover:bg-sidebar-accent/50" activeClassName="bg-sidebar-accent text-sidebar-primary font-medium">
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout} className="hover:bg-destructive/10 text-sidebar-foreground/70">
              <LogOut className="mr-2 h-4 w-4" />
              {!collapsed && <span>Logout</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
