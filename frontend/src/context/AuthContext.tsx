import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  getCurrentAdmin,
  loginAdmin,
  logoutAdmin,
} from "@/services/auth.service";
import { getApiErrorMessage } from "@/utils/apiError";

export type AdminUser = {
  id: number;
  email: string;
};

type AuthContextValue = {
  admin: AdminUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const data = await getCurrentAdmin();
      setAdmin(data);
    } catch {
      setAdmin(null);
    }
  }, []);

  useEffect(() => {
    void (async () => {
      setLoading(true);
      await refresh();
      setLoading(false);
    })();
  }, [refresh]);

  useEffect(() => {
    const onUnauthorized = () => setAdmin(null);
    window.addEventListener("portfolio:admin-unauthorized", onUnauthorized);
    return () => window.removeEventListener("portfolio:admin-unauthorized", onUnauthorized);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      await loginAdmin(email, password);
      await refresh();
    } catch (error) {
      throw new Error(getApiErrorMessage(error, "Login failed"));
    }
  }, [refresh]);

  const logout = useCallback(async () => {
    try {
      await logoutAdmin();
    } finally {
      setAdmin(null);
    }
  }, []);

  const value = useMemo(
    () => ({ admin, loading, login, logout, refresh }),
    [admin, loading, login, logout, refresh],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}