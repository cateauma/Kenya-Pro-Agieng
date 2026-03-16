import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  console.warn("Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. Using mock mode.");
}

export const supabase = createClient<Database>(url ?? "https://placeholder.supabase.co", anonKey ?? "placeholder", {
  auth: { persistSession: true, autoRefreshToken: true },
});

export function hasSupabaseConfig() {
  return Boolean(url && anonKey && url !== "https://placeholder.supabase.co");
}
