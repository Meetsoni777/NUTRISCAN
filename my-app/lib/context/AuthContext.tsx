"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { loginUser, registerUser, logoutUser, getCurrentUser } from "../api/auth";
import type { User } from "../types";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("access_token")
          : null;
      if (token) {
        await refreshUser();
      }
      setIsLoading(false);
    };
    init();
  }, [refreshUser]);

  const login = async (email: string, password: string) => {
    const data = await loginUser(email, password);
    setUser(data.user);
  };

  const register = async (name: string, email: string, password: string) => {
    const data = await registerUser(name, email, password);
    setUser(data.user);
  };

  const logout = () => {
    logoutUser();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        isAdmin: user?.role === "admin",
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
