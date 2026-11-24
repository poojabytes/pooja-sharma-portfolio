import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { OwnerField, OwnerInput } from "@/components/owner/OwnerField";
import { useAuth } from "@/context/AuthContext";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

type FormValues = z.infer<typeof schema>;

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function OwnerLoginModal({ open, onClose }: Props) {
  const { login, isOwner } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (!open) {
      reset();
      setError(null);
    }
  }, [open, reset]);

  useEffect(() => {
    if (isOwner && open) onClose();
  }, [isOwner, open, onClose]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const onSubmit = async (values: FormValues) => {
    setError(null);
    try {
      await login(values.email, values.password);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    }
  };

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-foreground/40 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="owner-login-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-border bg-background p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <h2 id="owner-login-title" className="font-display text-xl font-bold">
              Owner sign in
            </h2>
            <p className="mt-1 text-sm text-muted">
              Edit your portfolio directly on this site. Visitors never see these controls.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-border p-2 text-muted hover:text-foreground"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <OwnerField label="Email" error={errors.email?.message}>
            <OwnerInput type="email" autoComplete="username" {...register("email")} />
          </OwnerField>
          <OwnerField label="Password" error={errors.password?.message}>
            <OwnerInput
              type="password"
              autoComplete="current-password"
              {...register("password")}
            />
          </OwnerField>
          {error ? <p className="text-sm text-red-500">{error}</p> : null}
          <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
