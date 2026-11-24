import { useCallback, useEffect, useState } from "react";
import { LogOut, Pencil } from "lucide-react";
import OwnerLoginModal from "@/components/owner/OwnerLoginModal";
import { useAuth } from "@/context/AuthContext";

/** Floating owner controls + login shortcut (Ctrl/Cmd + Shift + E). */
export default function OwnerToolbar() {
  const { isOwner, owner, logout, loading } = useAuth();
  const [loginOpen, setLoginOpen] = useState(false);

  const openLogin = useCallback(() => setLoginOpen(true), []);
  const closeLogin = useCallback(() => setLoginOpen(false), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "e") {
        e.preventDefault();
        if (isOwner) return;
        openLogin();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOwner, openLogin]);

  useEffect(() => {
    const onOpen = () => openLogin();
    window.addEventListener("portfolio:owner-login", onOpen);
    return () => window.removeEventListener("portfolio:owner-login", onOpen);
  }, [openLogin]);

  if (loading) return null;

  return (
    <>
      <OwnerLoginModal open={loginOpen} onClose={closeLogin} />
      {isOwner ? (
        <div className="fixed bottom-4 left-1/2 z-[70] flex -translate-x-1/2 items-center gap-3 rounded-full border border-border bg-background/95 px-4 py-2.5 shadow-lg backdrop-blur">
          <span className="inline-flex items-center gap-2 text-xs font-semibold sm:text-sm">
            <Pencil className="h-3.5 w-3.5 text-accent" aria-hidden />
            Editing as {owner?.email}
          </span>
          <button
            type="button"
            onClick={() => void logout()}
            className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-xs font-medium text-muted transition hover:text-foreground"
          >
            <LogOut className="h-3.5 w-3.5" aria-hidden />
            Sign out
          </button>
        </div>
      ) : null}
    </>
  );
}

export function requestOwnerLogin() {
  window.dispatchEvent(new Event("portfolio:owner-login"));
}
