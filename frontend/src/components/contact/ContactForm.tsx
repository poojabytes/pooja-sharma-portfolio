import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Loader2, Send } from "lucide-react";
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
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

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

  return (
    <AnimatePresence mode="wait" initial={false}>
      {submitted ? (
        <motion.div
          key="done"
          role="status"
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          className="glass-panel flex flex-col items-center gap-4 rounded-3xl p-10 text-center"
        >
          <motion.span
            initial={{ scale: 0, rotate: -40 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 12, delay: 0.1 }}
            className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-400/15 text-emerald-400"
          >
            <CheckCircle2 className="h-8 w-8" />
          </motion.span>
          <p className="font-display text-xl font-bold">Thank you — message received.</p>
          <p className="text-sm text-muted">I&apos;ll get back to you as soon as I can.</p>
          <button type="button" onClick={() => setSubmitted(false)} className="btn-ghost mt-2">
            Send another
          </button>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="glass-panel space-y-4 rounded-3xl p-6 md:p-8"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Name" error={errors.name?.message}>
              <input {...register("name")} className={inputClass(errors.name)} autoComplete="name" />
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
            <textarea {...register("message")} rows={5} className={inputClass(errors.message)} />
          </Field>
          {submitError ? (
            <p role="alert" className="text-sm text-red-400">
              {submitError}
            </p>
          ) : null}
          <button type="submit" disabled={isSubmitting} className="btn-primary group w-full sm:w-auto">
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> Sending...
              </>
            ) : (
              <>
                Send message
                <Send
                  className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-1"
                  aria-hidden
                />
              </>
            )}
          </button>
        </motion.form>
      )}
    </AnimatePresence>
  );
}

function inputClass(hasError: unknown) {
  return [
    "w-full rounded-xl border bg-background/60 px-4 py-3 text-sm outline-none transition",
    "focus:border-accent/70 focus:bg-background focus:shadow-[0_0_0_4px_rgb(var(--c-accent)/0.15)]",
    hasError ? "border-red-400/60" : "border-border",
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
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-label text-muted">
        {label}
      </span>
      {children}
      <AnimatePresence>
        {error ? (
          <motion.span
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-1 block text-xs text-red-400"
          >
            {error}
          </motion.span>
        ) : null}
      </AnimatePresence>
    </label>
  );
}