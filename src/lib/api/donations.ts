import { supabase, hasSupabaseConfig } from "@/lib/supabase";
import type { DonationRow } from "@/lib/database.types";

export async function fetchDonations(): Promise<DonationRow[]> {
  if (!hasSupabaseConfig()) return [];
  const { data, error } = await supabase.from("donations").select("*").order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as DonationRow[];
}

export interface CreateDonationInput {
  donor_name: string;
  amount_cents: number;
  currency?: string;
  type: string;
}

export async function createDonation(input: CreateDonationInput, recordedBy?: string): Promise<DonationRow> {
  if (!hasSupabaseConfig()) throw new Error("Database not configured");
  const { data, error } = await supabase
    .from("donations")
    .insert({
      donor_name: input.donor_name,
      amount_cents: input.amount_cents,
      currency: input.currency ?? "KES",
      type: input.type,
      status: "Active",
      recorded_by: recordedBy ?? null,
    })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as DonationRow;
}
