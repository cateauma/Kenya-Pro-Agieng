import { apiFetch, setStoredToken } from "./client";

export interface BackendUser {
  id: string;
  email: string;
  full_name: string;
  role: string;
  approval_status: string;
}

export interface LoginResponse {
  token: string;
  user: BackendUser;
}

export interface RegisterPayload {
  email: string;
  password: string;
  full_name: string;
  phone_number: string;
  role: string;
  id_number?: string;
  location?: string;
  date_of_birth?: string;
  photo_url?: string;
}

export async function backendLogin(email: string, password: string): Promise<LoginResponse> {
  const data = await apiFetch<LoginResponse>("/api/auth/login", {
    method: "POST",
    body: { email, password },
  });
  setStoredToken(data.token);
  return data;
}

export async function backendRegister(payload: RegisterPayload): Promise<{ user: BackendUser }> {
  const data = await apiFetch<{ user: BackendUser; message?: string }>("/api/auth/register", {
    method: "POST",
    body: payload,
  });
  return { user: data.user };
}

export async function backendGetMe(): Promise<BackendUser | null> {
  try {
    const data = await apiFetch<{ user: BackendUser }>("/api/auth/me");
    return data.user;
  } catch {
    return null;
  }
}
