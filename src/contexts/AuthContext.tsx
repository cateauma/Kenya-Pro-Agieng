import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { UserRole, ROLE_CONFIGS } from "@/lib/roles";
import { supabase, hasSupabaseConfig } from "@/lib/supabase";
import { hasBackendConfig, getStoredToken, setStoredToken } from "@/lib/api/client";
import { backendLogin, backendRegister, backendGetMe } from "@/lib/api/backend-auth";
import type { ProfileRow } from "@/lib/database.types";

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: "pending" | "approved" | "rejected";
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  setMockUser: (role: UserRole) => void;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  phone?: string;
  idNumber?: string;
  location?: string;
  dateOfBirth?: string;
}

function profileToUser(p: ProfileRow): User {
  return {
    id: p.id,
    name: p.name,
    email: p.email,
    role: p.role as UserRole,
    status: p.status,
    avatar: p.avatar_url ?? undefined,
  };
}

function backendUserToUser(u: { id: string; email: string; full_name: string; role: string; approval_status: string }): User {
  return {
    id: u.id,
    name: u.full_name,
    email: u.email,
    role: u.role as UserRole,
    status: u.approval_status === "approved" ? "approved" : u.approval_status === "rejected" ? "rejected" : "pending",
  };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = useCallback(async (userId: string): Promise<ProfileRow | null> => {
    const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single();
    if (error || !data) return null;
    return data as ProfileRow;
  }, []);

  const ensureProfileForAuthUser = useCallback(
    async (userId: string, email: string, name: string): Promise<ProfileRow> => {
      const existing = await fetchProfile(userId);
      if (existing) return existing;
      const isAdminEmail = email.toLowerCase() === "admin@gmail.com";
      const { data, error } = await supabase
        .from("profiles")
        .insert({
          id: userId,
          email,
          name: name || (isAdminEmail ? "Admin" : "User"),
          role: isAdminEmail ? "admin" : "beneficiary",
          status: isAdminEmail ? "approved" : "pending",
        })
        .select()
        .single();
      if (error) throw new Error(error.message);
      return data as ProfileRow;
    },
    [fetchProfile]
  );

  // Backend: restore session from stored token
  useEffect(() => {
    if (hasBackendConfig()) {
      const token = getStoredToken();
      if (!token) {
        setIsLoading(false);
        return;
      }
      backendGetMe()
        .then((u) => {
          if (u) setUser(backendUserToUser(u));
        })
        .finally(() => setIsLoading(false));
      return;
    }
    if (!hasSupabaseConfig()) {
      setIsLoading(false);
      return;
    }
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_OUT" || !session) {
        setUser(null);
        setIsLoading(false);
        return;
      }
      try {
        let profile = await fetchProfile(session.user.id);
        if (!profile && session.user.email) {
          profile = await ensureProfileForAuthUser(
            session.user.id,
            session.user.email,
            session.user.user_metadata?.name ?? session.user.email.split("@")[0]
          );
        }
        if (profile) setUser(profileToUser(profile));
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        setIsLoading(false);
        return;
      }
      fetchProfile(session.user.id).then((profile) => {
        if (profile) setUser(profileToUser(profile));
        else if (session.user.email) {
          ensureProfileForAuthUser(
            session.user.id,
            session.user.email,
            session.user.user_metadata?.name ?? session.user.email.split("@")[0]
          ).then((p) => setUser(profileToUser(p))).catch(() => setUser(null));
        } else setUser(null);
        setIsLoading(false);
      }).catch(() => setIsLoading(false));
    });

    return () => subscription.unsubscribe();
  }, [fetchProfile, ensureProfileForAuthUser]);

  const login = async (email: string, password: string): Promise<User> => {
    if (hasBackendConfig()) {
      const { user: u } = await backendLogin(email, password);
      const mapped = backendUserToUser(u);
      setUser(mapped);
      return mapped;
    }
    if (!hasSupabaseConfig()) {
      const u: User = {
        id: "1",
        name: "Admin User",
        email,
        role: "admin",
        status: "approved",
      };
      setUser(u);
      return u;
    }
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message);
    if (!data.user) throw new Error("Login failed");
    let profile = await fetchProfile(data.user.id);
    if (!profile && data.user.email) {
      profile = await ensureProfileForAuthUser(
        data.user.id,
        data.user.email,
        data.user.user_metadata?.name ?? data.user.email.split("@")[0]
      );
    }
    if (!profile) throw new Error("Could not load profile");
    const u = profileToUser(profile);
    setUser(u);
    return u;
  };

  const register = async (data: RegisterData) => {
    if (hasBackendConfig()) {
      const payload = {
        email: data.email,
        password: data.password,
        full_name: data.name,
        phone_number: data.phone || "",
        role: data.role,
        id_number: data.idNumber,
        location: data.location,
        date_of_birth: data.dateOfBirth,
        photo_url: data.role === "beneficiary" ? "pending" : undefined,
      };
      const { user: u } = await backendRegister(payload);
      setUser(backendUserToUser(u));
      return;
    }
    if (!hasSupabaseConfig()) {
      setUser({
        id: Math.random().toString(36).slice(2),
        name: data.name,
        email: data.email,
        role: data.role,
        status: "pending",
      });
      return;
    }
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: { data: { name: data.name } },
    });
    if (authError) throw new Error(authError.message);
    if (!authData.user) throw new Error("Registration failed");
    const { error: profileError } = await supabase.from("profiles").insert({
      id: authData.user.id,
      email: data.email,
      name: data.name,
      role: data.role,
      status: "pending",
      phone: data.phone ?? null,
      id_number: data.idNumber ?? null,
      location: data.location ?? null,
      date_of_birth: data.dateOfBirth ?? null,
    });
    if (profileError) throw new Error(profileError.message);
    const profile = await fetchProfile(authData.user.id);
    if (profile) setUser(profileToUser(profile));
  };

  const logout = () => {
    if (hasBackendConfig()) setStoredToken(null);
    else if (hasSupabaseConfig()) supabase.auth.signOut();
    setUser(null);
  };

  const setMockUser = (role: UserRole) => {
    if (hasBackendConfig() || hasSupabaseConfig()) return;
    setUser({
      id: "mock-" + role,
      name: ROLE_CONFIGS[role].label + " User",
      email: role + "@kpao.org",
      role,
      status: "approved",
    });
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, register, logout, setMockUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
