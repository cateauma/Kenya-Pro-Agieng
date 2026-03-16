import { apiFetch, hasBackendConfig } from "@/lib/api/client";

export interface Opportunity {
  id: string;
  title: string;
  date: string;
  location: string;
  slots: number;
  duration_hours?: number;
  category: string;
  type: "opportunity" | "event";
  description?: string;
  created_at?: string;
  signed_up_count?: number;
}

export interface VolunteerSignup {
  id: string;
  opportunity_id: string;
  volunteer_id: string;
  created_at: string;
  opportunity?: Opportunity;
}

export async function fetchOpportunities(type?: "event" | "opportunity"): Promise<Opportunity[]> {
  if (!hasBackendConfig()) return [];
  const q = type ? `?type=${type}` : "";
  const { opportunities } = await apiFetch<{ opportunities: Opportunity[] }>(`/api/opportunities${q}`);
  return opportunities ?? [];
}

export async function fetchMySignups(): Promise<VolunteerSignup[]> {
  if (!hasBackendConfig()) return [];
  try {
    const { signups } = await apiFetch<{ signups: VolunteerSignup[] }>("/api/volunteers/me/signups");
    return signups ?? [];
  } catch {
    return [];
  }
}

export async function signupForOpportunity(opportunityId: string): Promise<void> {
  await apiFetch(`/api/opportunities/${opportunityId}/signup`, { method: "POST" });
}

export async function cancelSignup(opportunityId: string): Promise<void> {
  await apiFetch(`/api/opportunities/${opportunityId}/signup`, { method: "DELETE" });
}
