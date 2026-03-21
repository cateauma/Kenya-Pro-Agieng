import { apiFetch, hasBackendConfig } from "@/lib/api/client";

export type ProgramStatus = "Active" | "Completed" | "Upcoming";

export interface Program {
  id: string;
  name: string;
  description: string;
  region: string;
  status: ProgramStatus;
  start_date?: string | null;
  end_date?: string | null;
  budget?: number | null;
  goals?: string;
  beneficiaries_count?: number;
  progress?: number;
  created_at: string;
}

export interface CreateProgramInput {
  name: string;
  description?: string;
  region?: string;
  status?: ProgramStatus;
  start_date?: string;
  end_date?: string;
  budget?: number;
  goals?: string;
}

export async function fetchPrograms(): Promise<Program[]> {
  if (!hasBackendConfig()) {
    return [];
  }
  const { programs } = await apiFetch<{ programs: Program[] }>("/api/programs");
  return programs ?? [];
}

export async function createProgram(input: CreateProgramInput): Promise<Program> {
  const program = await apiFetch<Program>("/api/programs", {
    method: "POST",
    body: input,
  });
  return program;
}

