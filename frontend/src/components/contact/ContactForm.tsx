import { zodResolver } from "@hookform/resolvers/zod";
import { useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "@/context/ToastContext";
import { submitContact } from "@/services/contact.service";

const schema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  email: z.string().email("Valid email required"),
  subject: z.string().min(1, "Subject is required").max(255),
  message: z.string().min(10, "Message must be at least 10 characters").max(5000),
});

type FormValues = z.infer<typeof schema>;

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const toast = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (values: FormValues) => {
    setSubmitError(null);
    try {
      await submitContact(values);
      setSubmitted(true);
      toast.push("success", "Message sent");
      reset();
    } catch {
      const msg = "Could not send your message. Please try again.";
      setSubmitError(msg);
      toast.push("error", msg);
    }
  };

  if (submitted) {
    return (
      <div className="bento-card text-sm text-muted" role="status">
        Thank you — your message was sent successfully.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bento-card space-y-4" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Name" error={errors.name?.message}>
          <input
            {...register("name")}
            className={inputClass(errors.name)}
            autoComplete="name"
          />
        </Field>
        <Field label="Email" error={errors.email?.message}>
          <input
            {...register("email")}
            type="email"
            className={inputClass(errors.email)}
            autoComplete="email"
          />
        </Field>
      </div>
      <Field label="Subject" error={errors.subject?.message}>
        <input {...register("subject")} className={inputClass(errors.subject)} />
      </Field>
      <Field label="Message" error={errors.message?.message}>
        <textarea
          {...register("message")}
          rows={5}
          className={inputClass(errors.message)}
        />
      </Field>
      {submitError ? <p className="text-sm text-red-400">{submitError}</p> : null}
      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-xl bg-accent px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-60"
      >
        {isSubmitting ? "Sending..." : "Send message"}
      </button>
    </form>
  );
}

function inputClass(hasError: unknown) {
  return [
    "w-full rounded-xl border bg-background px-3 py-2 text-sm outline-none transition",
    "border-border focus:border-accent/60 focus:ring-2 focus:ring-accent/20",
    hasError ? "border-red-400/60" : "",
  ].join(" ");
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-muted">{label}</span>
      {children}
      {error ? <span className="mt-1 block text-xs text-red-400">{error}</span> : null}
    </label>
  );
}