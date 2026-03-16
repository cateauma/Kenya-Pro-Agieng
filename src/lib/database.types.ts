export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type ProfileStatus = "pending" | "approved" | "rejected";

export type ProfileRole =
  | "admin"
  | "program_manager"
  | "social_worker"
  | "healthcare_coordinator"
  | "finance_manager"
  | "donor"
  | "beneficiary"
  | "caregiver"
  | "volunteer";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          name: string;
          role: ProfileRole;
          status: ProfileStatus;
          phone: string | null;
          id_number: string | null;
          location: string | null;
          date_of_birth: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          name: string;
          role: ProfileRole;
          status?: ProfileStatus;
          phone?: string | null;
          id_number?: string | null;
          location?: string | null;
          date_of_birth?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          role?: ProfileRole;
          status?: ProfileStatus;
          phone?: string | null;
          id_number?: string | null;
          location?: string | null;
          date_of_birth?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      donations: {
        Row: {
          id: string;
          donor_name: string;
          amount_cents: number;
          currency: string;
          type: string;
          status: string;
          recorded_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          donor_name: string;
          amount_cents: number;
          currency?: string;
          type: string;
          status?: string;
          recorded_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          donor_name?: string;
          amount_cents?: number;
          currency?: string;
          type?: string;
          status?: string;
          recorded_by?: string | null;
          updated_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}

export type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];
export type DonationRow = Database["public"]["Tables"]["donations"]["Row"];
