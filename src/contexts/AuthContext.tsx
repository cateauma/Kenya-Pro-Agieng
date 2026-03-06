import React, { createContext, useContext, useState, ReactNode } from "react";
import { UserRole, ROLE_CONFIGS } from "@/lib/roles";

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
  login: (email: string, password: string) => Promise<void>;
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

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, _password: string) => {
    // Mock login - always succeeds as admin for demo
    setUser({
      id: "1",
      name: "Admin User",
      email,
      role: "admin",
      status: "approved",
    });
  };

  const register = async (data: RegisterData) => {
    setUser({
      id: Math.random().toString(36).slice(2),
      name: data.name,
      email: data.email,
      role: data.role,
      status: "pending",
    });
  };

  const logout = () => setUser(null);

  const setMockUser = (role: UserRole) => {
    setUser({
      id: "mock-" + role,
      name: ROLE_CONFIGS[role].label + " User",
      email: role + "@kpao.org",
      role,
      status: "approved",
    });
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, logout, setMockUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
