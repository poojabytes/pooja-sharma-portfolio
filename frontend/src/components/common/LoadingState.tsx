import { Loader2 } from "lucide-react";

export default function LoadingState({ label = "Loading..." }: { label?: string }) {
  return (
    <div
      className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-muted"
      role="status"
      aria-live="polite"
    >
      <Loader2 className="h-8 w-8 animate-spin text-accent" aria-hidden />
      <p className="text-sm">{label}</p>
    </div>
  );
}