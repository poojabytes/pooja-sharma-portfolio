import { useState, type ReactNode } from "react";
import { ChevronDown, Pencil } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

/** Renders children only when the portfolio owner is signed in. */
export function OwnerOnly({ children }: { children: ReactNode }) {
  const { isOwner } = useAuth();
  if (!isOwner) return null;
  return <>{children}</>;
}

/** Collapsible inline editor shell shown only to the signed-in owner. */
export function OwnerEditPanel({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  const { isOwner } = useAuth();
  const [open, setOpen] = useState(defaultOpen);

  if (!isOwner) return null;

  return (
    <div className="mt-6 rounded-2xl border border-dashed border-accent/45 bg-secondary/70 p-4 md:p-5">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-3 text-left"
        aria-expanded={open}
      >
        <span className="inline-flex items-center gap-2 text-sm font-semibold text-foreground">
          <Pencil className="h-4 w-4 text-accent" aria-hidden />
          Edit {title}
        </span>
        <ChevronDown
          className={`h-4 w-4 text-muted transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>
      {open ? <div className="mt-4 space-y-4 border-t border-border pt-4">{children}</div> : null}
    </div>
  );
}
