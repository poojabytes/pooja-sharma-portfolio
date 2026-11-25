import { Mail } from "lucide-react";
import { useState } from "react";

const iconClass =
  "flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-background/40 text-muted transition duration-300 hover:-translate-y-0.5 hover:border-accent/50 hover:bg-accent/10 hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

type Props = {
  email: string;
  size?: "md" | "sm";
};

export default function EmailIconLink({ email, size = "md" }: Props) {
  const [open, setOpen] = useState(false);
  const dim = size === "sm" ? "h-11 w-11" : "h-12 w-12";

  return (
    <div className="relative">
      <a
        href={`mailto:${email}`}
        className={`${iconClass} ${dim}`}
        aria-label="Send email"
        title={email}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
      >
        <Mail className={size === "sm" ? "h-4 w-4" : "h-5 w-5"} aria-hidden />
      </a>
      <span
        role="tooltip"
        className={`pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 max-w-[min(16rem,calc(100vw-2rem))] -translate-x-1/2 truncate rounded-lg bg-foreground px-3 py-1.5 text-xs font-medium text-on-accent shadow-md transition duration-200 ${
          open ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"
        }`}
      >
        {email}
      </span>
    </div>
  );
}