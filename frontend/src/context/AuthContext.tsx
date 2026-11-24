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

export type OwnerUser = {
  id: number;
  email: string;
};

type AuthContextValue = {
  owner: OwnerUser | null;
  /** True when the portfolio owner is authenticated. */
  isOwner: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [owner, setOwner] = useState<OwnerUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const data = await getCurrentAdmin();
      setOwner(data);
    } catch {
      setOwner(null);
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
    const onUnauthorized = () => setOwner(null);
    window.addEventListener("portfolio:admin-unauthorized", onUnauthorized);
    return () => window.removeEventListener("portfolio:admin-unauthorized", onUnauthorized);
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        await loginAdmin(email, password);
        await refresh();
      } catch (error) {
        throw new Error(getApiErrorMessage(error, "Login failed"));
      }
    },
    [refresh],
  );

  const logout = useCallback(async () => {
    try {
      await logoutAdmin();
    } finally {
      setOwner(null);
    }
  }, []);

  const value = useMemo(
    () => ({
      owner,
      isOwner: Boolean(owner),
      loading,
      login,
      logout,
      refresh,
    }),
    [owner, loading, login, logout, refresh],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
