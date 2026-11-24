import { motion } from "framer-motion";
import { ArrowUpRight, Check, Copy } from "lucide-react";
import { useState } from "react";
import ContactForm from "@/components/contact/ContactForm";
import Section from "@/components/common/Section";
import Magnetic from "@/components/effects/Magnetic";
import SplitText from "@/components/effects/SplitText";
import MessagesEditor from "@/components/owner/editors/MessagesEditor";
import SocialLinksEditor from "@/components/owner/editors/SocialLinksEditor";
import { useToast } from "@/context/ToastContext";
import type { SocialLink } from "@/types/portfolio";
import { iconSocialLinks, socialIcon } from "@/utils/social";

type Props = {
  email?: string | null;
  socialLinks?: SocialLink[];
};

export default function ContactSection({ email, socialLinks = [] }: Props) {
  const [copied, setCopied] = useState(false);
  const toast = useToast();

  const copy = async () => {
    if (!email) return;
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      toast.push("info", "Email copied to clipboard");
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.push("error", "Could not copy email");
    }
  };

  return (
    <Section id="contact" tone="violet" side="left" className="!pb-24">
      <div className="relative overflow-hidden rounded-3xl border border-border bg-secondary p-4 sm:rounded-[2.5rem] sm:p-8 md:p-14">
        {/* Soft decorative circles */}
        <div
          aria-hidden
          className="absolute -right-20 -top-20 h-64 w-64 animate-float rounded-full bg-peach/60"
        />
        <div
          aria-hidden
          className="absolute -bottom-16 -left-12 h-44 w-44 animate-float rounded-full bg-accent-2/40"
          style={{ animationDelay: "2s" }}
        />

        <div className="relative grid gap-12 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-6">
            <p className="label mb-5">Contact · 05</p>
            <h2 className="font-display text-[clamp(1.65rem,6.5vw,3.75rem)] font-extrabold uppercase leading-[1.05] tracking-tight sm:text-5xl xl:text-6xl">
              <SplitText text="Have a project in mind?" className="block" />
              <SplitText
                text="Let's build something great."
                highlight={["something", "great"]}
                className="block"
                delay={0.2}
              />
            </h2>
            <motion.p
              className="mt-6 max-w-md text-base leading-relaxed text-muted md:text-lg"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              Open to conversations about backend systems, APIs and full stack work. Send a message and
              I&apos;ll get back to you.
            </motion.p>

            {email ? (
              <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center">
                <Magnetic className="w-full sm:w-auto">
                  <a
                    href={`mailto:${email}`}
                    className="btn-primary group relative w-full justify-center overflow-hidden !px-5 !py-3.5 text-sm sm:w-auto sm:min-w-[min(100%,22rem)] sm:!px-6 sm:text-base"
                  >
                    <span className="relative block h-6 min-w-0 flex-1 overflow-hidden text-center sm:text-left">
                      <span className="block transition-transform duration-300 group-hover:-translate-y-full">
                        {email}
                      </span>
                      <span
                        aria-hidden
                        className="absolute inset-x-0 top-full block transition-transform duration-300 group-hover:-translate-y-full"
                      >
                        Send an email
                      </span>
                    </span>
                    <ArrowUpRight
                      className="h-5 w-5 transition-transform duration-300 group-hover:rotate-45"
                      aria-hidden
                    />
                  </a>
                </Magnetic>
                <button
                  type="button"
                  onClick={() => void copy()}
                  className="btn-ghost w-full justify-center sm:w-auto sm:!px-4"
                  aria-label="Copy email address"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-emerald-400" aria-hidden />
                  ) : (
                    <Copy className="h-4 w-4" aria-hidden />
                  )}
                </button>
              </div>
            ) : null}

            {iconSocialLinks(socialLinks).length > 0 ? (
              <ul className="mt-8 flex flex-wrap gap-3">
                {iconSocialLinks(socialLinks).map((l) => {
                  const Icon = socialIcon(l.platform);
                  return (
                    <li key={l.id}>
                      <a
                        href={l.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={l.label}
                        className="flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-background/40 text-muted transition duration-300 hover:-translate-y-1 hover:rotate-6 hover:border-accent/60 hover:bg-accent/10 hover:text-foreground"
                      >
                        <Icon className="h-5 w-5" />
                      </a>
                    </li>
                  );
                })}
              </ul>
            ) : null}
          </div>

          <div className="lg:col-span-6">
            <ContactForm />
          </div>
        </div>

        <SocialLinksEditor socialLinks={socialLinks} />
        <MessagesEditor />
      </div>
    </Section>
  );
}