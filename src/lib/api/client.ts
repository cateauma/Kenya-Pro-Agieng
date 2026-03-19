/**
 * Backend API client. Uses deployed backend in production.
 */

const API_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, "");
const FALLBACK_API = "https://kenya-pro-agieng.onrender.com";

const baseUrl = API_URL || FALLBACK_API;

export function hasBackendConfig(): boolean {
  return Boolean(baseUrl);
}

const TOKEN_KEY = "kpao_token";

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string | null): void {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

export async function apiFetch<T = unknown>(
  path: string,
  options: RequestInit & { body?: object } = {}
): Promise<T> {
  const url = `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;

  const { body, ...rest } = options;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  const token = getStoredToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(url, {
    ...rest,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(
      data?.error || data?.message || `Request failed: ${res.status}`
    );
  }

  return data as T;
}