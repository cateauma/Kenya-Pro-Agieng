export type UserRole =
  | "admin"
  | "program_manager"
  | "social_worker"
  | "healthcare_coordinator"
  | "finance_manager"
  | "donor"
  | "beneficiary"
  | "caregiver"
  | "volunteer";

export interface RoleConfig {
  label: string;
  description: string;
  color: string;
  dashboardPath: string;
}

export const ROLE_CONFIGS: Record<UserRole, RoleConfig> = {
  admin: {
    label: "Admin",
    description: "System administrator with full oversight",
    color: "bg-primary text-primary-foreground",
    dashboardPath: "/admin",
  },
  program_manager: {
    label: "Program Manager",
    description: "Coordinates programs and assigns tasks",
    color: "bg-info text-info-foreground",
    dashboardPath: "/program-manager",
  },
  social_worker: {
    label: "Social Worker",
    description: "Case management and elderly assessments",
    color: "bg-accent text-accent-foreground",
    dashboardPath: "/social-worker",
  },
  healthcare_coordinator: {
    label: "Healthcare Coordinator",
    description: "Health monitoring and check-up scheduling",
    color: "bg-success text-success-foreground",
    dashboardPath: "/healthcare",
  },
  finance_manager: {
    label: "Finance Manager",
    description: "Donation tracking and financial oversight",
    color: "bg-warning text-warning-foreground",
    dashboardPath: "/finance",
  },
  donor: {
    label: "Donor",
    description: "View impact and make contributions",
    color: "bg-secondary text-secondary-foreground",
    dashboardPath: "/donor",
  },
  beneficiary: {
    label: "Beneficiary",
    description: "Elderly person receiving care services",
    color: "bg-primary text-primary-foreground",
    dashboardPath: "/beneficiary",
  },
  caregiver: {
    label: "Caregiver",
    description: "Manages schedules and logs interactions",
    color: "bg-accent text-accent-foreground",
    dashboardPath: "/caregiver",
  },
  volunteer: {
    label: "Volunteer",
    description: "Sign up for opportunities and track hours",
    color: "bg-info text-info-foreground",
    dashboardPath: "/volunteer",
  },
};

export const REGISTRATION_ROLES: UserRole[] = [
  "volunteer",
  "donor",
  "beneficiary",
  "caregiver",
  "social_worker",
  "program_manager",
  "healthcare_coordinator",
  "finance_manager",
];
