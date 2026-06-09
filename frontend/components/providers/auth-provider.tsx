"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import * as api from "@/lib/api";
import type { User } from "@/lib/api";

type AuthContextValue = {
  user: User | null;
  /** True until the initial `GET /user/me` session check resolves. */
  loading: boolean;
  login: (input: { email: string; password: string }) => Promise<User>;
  register: (input: {
    email: string;
    name: string;
    password: string;
  }) => Promise<User>;
  logout: () => Promise<void>;
  updateAccount: (input: {
    email?: string;
    name?: string;
    password?: string;
  }) => Promise<User>;
  deleteAccount: (password: string) => Promise<void>;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Restore the session from the httpOnly cookie on first load.
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const me = await api.getMe();
        if (active) setUser(me);
      } catch {
        if (active) setUser(null);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const refresh = useCallback(async () => {
    try {
      setUser(await api.getMe());
    } catch {
      setUser(null);
    }
  }, []);

  const login = useCallback(async (input: { email: string; password: string }) => {
    const u = await api.login(input);
    setUser(u);
    return u;
  }, []);

  const register = useCallback(
    async (input: { email: string; name: string; password: string }) => {
      const u = await api.register(input);
      setUser(u);
      return u;
    },
    []
  );

  const logout = useCallback(async () => {
    await api.logout();
    setUser(null);
  }, []);

  const updateAccount = useCallback(
    async (input: { email?: string; name?: string; password?: string }) => {
      const u = await api.updateAccount(input);
      setUser(u);
      return u;
    },
    []
  );

  const deleteAccount = useCallback(async (password: string) => {
    await api.deleteAccount(password);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateAccount,
        deleteAccount,
        refresh,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
