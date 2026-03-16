import { supabase, hasSupabaseConfig } from "@/lib/supabase";
import { hasBackendConfig } from "@/lib/api/client";
import { fetchUsersFromBackend, fetchPendingUsersFromBackend, approveUserFromBackend, rejectUserFromBackend } from "@/lib/api/admin";
import type { ProfileRow } from "@/lib/database.types";
import type { ProfileStatus } from "@/lib/database.types";

const ROLE_LABELS: Record<string, string> = {
  admin: "Admin",
  program_manager: "Program Manager",
  social_worker: "Social Worker",
  healthcare_coordinator: "Healthcare Coordinator",
  finance_manager: "Finance Manager",
  donor: "Donor",
  beneficiary: "Beneficiary",
  caregiver: "Caregiver",
  volunteer: "Volunteer",
};

export function profileRoleLabel(role: string): string {
  return ROLE_LABELS[role] ?? role;
}

function backendUserToProfile(u: { id: string; email: string; full_name: string; role: string; approval_status: string; created_at: string }): ProfileRow {
  return {
    id: u.id,
    email: u.email,
    name: u.full_name,
    role: u.role as ProfileRow["role"],
    status: u.approval_status as ProfileRow["status"],
    phone: null,
    id_number: null,
    location: null,
    date_of_birth: null,
    avatar_url: null,
    created_at: u.created_at,
    updated_at: u.created_at,
  };
}

export async function fetchProfiles(): Promise<ProfileRow[]> {
  if (hasBackendConfig()) {
    const users = await fetchUsersFromBackend();
    return users.map(backendUserToProfile);
  }
  if (!hasSupabaseConfig()) return [];
  const { data, error } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as ProfileRow[];
}

export async function fetchPendingProfiles(): Promise<ProfileRow[]> {
  if (hasBackendConfig()) {
    const users = await fetchPendingUsersFromBackend();
    return users.map(backendUserToProfile);
  }
  if (!hasSupabaseConfig()) return [];
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("status", "pending")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as ProfileRow[];
}

export async function updateProfileStatus(id: string, status: ProfileStatus): Promise<void> {
  if (hasBackendConfig()) {
    if (status === "approved") await approveUserFromBackend(id);
    else if (status === "rejected") await rejectUserFromBackend(id);
    return;
  }
  if (!hasSupabaseConfig()) return;
  const { error } = await supabase.from("profiles").update({ status }).eq("id", id);
  if (error) throw new Error(error.message);
}
