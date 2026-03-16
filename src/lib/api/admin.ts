import { apiFetch } from "./client";

export interface BackendUser {
  id: string;
  email: string;
  full_name: string;
  phone_number?: string;
  role: string;
  approval_status: string;
  created_at: string;
}

export interface CreateUserPayload {
  email: string;
  password: string;
  full_name: string;
  phone_number: string;
  role: string;
}

export async function fetchUsersFromBackend(filters?: { role?: string; approval_status?: string }): Promise<BackendUser[]> {
  const params = new URLSearchParams();
  if (filters?.role) params.set("role", filters.role);
  if (filters?.approval_status) params.set("approval_status", filters.approval_status);
  const q = params.toString();
  const data = await apiFetch<{ users: BackendUser[] }>(`/api/admin/users${q ? `?${q}` : ""}`);
  return data.users;
}

export async function fetchPendingUsersFromBackend(): Promise<BackendUser[]> {
  const data = await apiFetch<{ users: BackendUser[] }>("/api/admin/pending-users");
  return data.users;
}

export async function approveUserFromBackend(userId: string): Promise<void> {
  await apiFetch(`/api/admin/approve-user/${userId}`, { method: "PUT" });
}

export async function rejectUserFromBackend(userId: string, reason?: string): Promise<void> {
  await apiFetch(`/api/admin/reject-user/${userId}`, { method: "PUT", body: reason ? { reason } : {} });
}

export async function createUserInBackend(payload: CreateUserPayload): Promise<BackendUser> {
  const data = await apiFetch<{ user: BackendUser }>("/api/admin/users", {
    method: "POST",
    body: payload,
  });
  return data.user;
}

export interface AdminSignup {
  id: string;
  created_at: string;
  volunteer_id: string;
  volunteer_name: string;
  volunteer_email: string;
  opportunity_id: string;
  opportunity_title: string;
  opportunity_date?: string;
  opportunity_type: string;
  opportunity_location?: string;
}

export async function fetchAdminSignups(): Promise<AdminSignup[]> {
  const data = await apiFetch<{ signups: AdminSignup[] }>("/api/admin/signups");
  return data.signups ?? [];
}

export interface AdminServiceRequest {
  id: string;
  beneficiary_id: string;
  beneficiary_name: string;
  beneficiary_email: string;
  service_id: string;
  service_name: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  reviewed_at: string | null;
  reviewed_by: string | null;
}

export async function fetchAdminServiceRequests(status?: "pending" | "approved" | "rejected"): Promise<AdminServiceRequest[]> {
  const q = status ? `?status=${status}` : "";
  const data = await apiFetch<{ requests: AdminServiceRequest[] }>(`/api/admin/service-requests${q}`);
  return data.requests ?? [];
}

export async function approveServiceRequest(requestId: string): Promise<void> {
  await apiFetch(`/api/admin/service-requests/${requestId}/approve`, { method: "PUT" });
}

export async function rejectServiceRequest(requestId: string): Promise<void> {
  await apiFetch(`/api/admin/service-requests/${requestId}/reject`, { method: "PUT" });
}
