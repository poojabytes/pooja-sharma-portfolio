import { forwardRef, type InputHTMLAttributes, type ReactNode, type TextareaHTMLAttributes } from "react";

const inputClass =
  "w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent/60 focus:ring-2 focus:ring-accent/20";

export function OwnerField({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-muted">{label}</span>
      {children}
      {hint ? <span className="mt-1 block text-xs text-muted">{hint}</span> : null}
      {error ? <span className="mt-1 block text-xs text-red-400">{error}</span> : null}
    </label>
  );
}

export const OwnerInput = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function OwnerInput({ className, ...props }, ref) {
    return <input ref={ref} {...props} className={[inputClass, className ?? ""].join(" ")} />;
  },
);

export const OwnerTextarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement>
>(function OwnerTextarea({ className, ...props }, ref) {
  return <textarea ref={ref} {...props} className={[inputClass, className ?? ""].join(" ")} />;
});
