import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { ADMIN_NAV } from "@/constants/adminNav";
import { useAuth } from "@/context/AuthContext";
import Seo from "@/components/common/Seo";

export default function AdminLayout() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-background lg:flex">
      <Seo title="Admin | Pooja Sharma Portfolio" />
      <aside
        className={[
          "fixed inset-y-0 left-0 z-40 w-64 border-r border-border bg-surface transition-transform lg:static lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        <div className="flex h-full flex-col p-4">
          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-accent">
              Admin
            </p>
            <p className="mt-1 truncate text-sm font-medium">{admin?.email}</p>
          </div>
          <nav className="flex-1 space-y-1 overflow-y-auto" aria-label="Admin">
            {ADMIN_NAV.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/admin/dashboard"}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  [
                    "flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition",
                    isActive
                      ? "bg-accent/15 text-foreground"
                      : "text-muted hover:bg-background hover:text-foreground",
                  ].join(" ")
                }
              >
                <Icon className="h-4 w-4 shrink-0" aria-hidden />
                {label}
              </NavLink>
            ))}
          </nav>
          <button
            type="button"
            onClick={() => void handleLogout()}
            className="mt-4 flex w-full items-center gap-2 rounded-xl border border-border px-3 py-2 text-sm text-muted transition hover:border-red-400/40 hover:text-red-300"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>

      {mobileOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          aria-label="Close menu"
          onClick={() => setMobileOpen(false)}
        />
      ) : null}

      <div className="flex min-h-screen flex-1 flex-col lg:min-w-0">
        <header className="flex items-center justify-between border-b border-border px-4 py-3 lg:hidden">
          <span className="text-sm font-semibold">Dashboard</span>
          <button
            type="button"
            className="rounded-lg border border-border p-2"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </header>
        <main className="flex-1 p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}