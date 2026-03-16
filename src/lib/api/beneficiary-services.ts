import { apiFetch, hasBackendConfig } from "@/lib/api/client";

export interface ServiceCatalogItem {
  id: string;
  name: string;
  description: string;
  active: boolean;
}

export interface ServiceRequest {
  id: string;
  beneficiary_id: string;
  service_id: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  reviewed_at: string | null;
  reviewed_by: string | null;
  service?: ServiceCatalogItem;
}

export async function fetchServiceCatalog(): Promise<ServiceCatalogItem[]> {
  if (!hasBackendConfig()) return [];
  try {
    const data = await apiFetch<{ services: ServiceCatalogItem[] }>("/api/beneficiary/services");
    return data.services ?? [];
  } catch {
    return [];
  }
}

export async function fetchMyServiceRequests(): Promise<ServiceRequest[]> {
  if (!hasBackendConfig()) return [];
  try {
    const data = await apiFetch<{ requests: ServiceRequest[] }>("/api/beneficiary/service-requests");
    return data.requests ?? [];
  } catch {
    return [];
  }
}

export async function requestService(serviceId: string): Promise<ServiceRequest> {
  const data = await apiFetch<ServiceRequest>("/api/beneficiary/service-requests", {
    method: "POST",
    body: { service_id: serviceId },
  });
  return data;
}
