import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, Navigate, useLocation } from "react-router-dom";
import { z } from "zod";
import Seo from "@/components/common/Seo";
import { AdminField, AdminInput } from "@/components/admin/AdminField";
import LoadingState from "@/components/common/LoadingState";
import { useAuth } from "@/context/AuthContext";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

type FormValues = z.infer<typeof schema>;

export default function Login() {
  const { admin, loading, login } = useAuth();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? "/admin/dashboard";
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  if (loading) return <LoadingState />;
  if (admin) return <Navigate to={from} replace />;

  const onSubmit = async (values: FormValues) => {
    setError(null);
    try {
      await login(values.email, values.password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <Seo title="Admin Login | Pooja Sharma" />
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-semibold">Admin login</h1>
        <p className="mt-2 text-sm text-muted">Secure session via HttpOnly cookie.</p>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bento-card mt-8 space-y-4"
          noValidate
        >
          <AdminField label="Email" error={errors.email?.message}>
            <AdminInput type="email" autoComplete="username" {...register("email")} />
          </AdminField>
          <AdminField label="Password" error={errors.password?.message}>
            <AdminInput
              type="password"
              autoComplete="current-password"
              {...register("password")}
            />
          </AdminField>
          {error ? <p className="text-sm text-red-400">{error}</p> : null}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-accent py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-60"
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>
        </form>
        <Link to="/" className="mt-6 inline-block text-sm text-accent hover:underline">
          ← Back to portfolio
        </Link>
      </div>
    </main>
  );
}