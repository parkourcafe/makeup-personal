import { createContext, type ReactNode, useContext, useEffect, useMemo, useState } from "react";

import { api, setApiAuthToken } from "../api/client";
import type { AuthRegisterPayload, User } from "../types";
import { clearStoredAuthToken, readStoredAuthToken, writeStoredAuthToken } from "./sessionStorage";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: AuthRegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bootstrap = async () => {
      const token = await readStoredAuthToken();
      if (!token) {
        setLoading(false);
        return;
      }
      setApiAuthToken(token);
      try {
        setUser(await api.getCurrentUser());
      } catch {
        setApiAuthToken(null);
        await clearStoredAuthToken();
      } finally {
        setLoading(false);
      }
    };

    void bootstrap();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      login: async (email: string, password: string) => {
        const response = await api.login(email, password);
        setApiAuthToken(response.access_token);
        await writeStoredAuthToken(response.access_token);
        setUser(response.user);
      },
      register: async (payload: AuthRegisterPayload) => {
        const response = await api.register(payload);
        setApiAuthToken(response.access_token);
        await writeStoredAuthToken(response.access_token);
        setUser(response.user);
      },
      logout: async () => {
        try {
          await api.logout();
        } finally {
          setApiAuthToken(null);
          await clearStoredAuthToken();
          setUser(null);
        }
      }
    }),
    [loading, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return value;
}
