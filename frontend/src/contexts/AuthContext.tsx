"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { api } from "@/lib/api";
import {
  UserProfile,
  AuthResponse,
  RegisterData,
  LoginData,
  storeAuth,
  clearAuth,
  getStoredUser,
  getAccessToken,
} from "@/lib/auth";

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = getStoredUser();
    if (stored && getAccessToken()) {
      setUser(stored);
      api.get<UserProfile>("/users/me")
        .then((res) => {
          setUser(res.data);
          localStorage.setItem("user", JSON.stringify(res.data));
        })
        .catch(() => {
          clearAuth();
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (data: LoginData) => {
    const res = await api.post<AuthResponse>("/auth/login", data);
    storeAuth(res.data);
    setUser(res.data.user);
  };

  const register = async (data: RegisterData) => {
    const res = await api.post<AuthResponse>("/auth/register", data);
    storeAuth(res.data);
    setUser(res.data.user);
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout", {});
    } catch {
      // Ignorer les erreurs de déconnexion côté serveur
    }
    clearAuth();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
