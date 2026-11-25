import { motion } from "framer-motion";
import ContactForm from "@/components/contact/ContactForm";
import EmailIconLink from "@/components/common/EmailIconLink";
import Section from "@/components/common/Section";
import SplitText from "@/components/effects/SplitText";
import MessagesEditor from "@/components/owner/editors/MessagesEditor";
import SocialLinksEditor from "@/components/owner/editors/SocialLinksEditor";
import type { SocialLink } from "@/types/portfolio";
import { iconSocialLinks, socialIcon } from "@/utils/social";

type Props = {
  email?: string | null;
  socialLinks?: SocialLink[];
};

export default function ContactSection({ email, socialLinks = [] }: Props) {
  const socials = iconSocialLinks(socialLinks);

  return (
    <Section id="contact" tone="violet" side="left" className="!pb-24">
      <div className="rounded-3xl border border-border bg-secondary p-4 sm:p-8 md:p-12 lg:p-14">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12 xl:gap-16">
          <div className="lg:col-span-5">
            <p className="label mb-4">Contact · 05</p>
            <h2 className="font-display text-[clamp(1.65rem,5vw,2.75rem)] font-bold leading-tight tracking-tight text-foreground">
              <SplitText text="Have a project in mind?" className="block" />
              <SplitText
                text="Let's build something great."
                highlight={["something", "great"]}
                className="mt-1 block"
                delay={0.15}
              />
            </h2>
            <motion.p
              className="mt-5 max-w-md text-base leading-relaxed text-muted md:text-lg"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              Open to conversations about backend systems, APIs and full stack work. Send a message and
              I&apos;ll get back to you.
            </motion.p>

            {(socials.length > 0 || email) && (
              <ul className="mt-8 flex flex-wrap items-center gap-3">
                {socials.map((l) => {
                  const Icon = socialIcon(l.platform);
                  return (
                    <li key={l.id}>
                      <a
                        href={l.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={l.label}
                        className="flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-background/60 text-muted transition duration-300 hover:-translate-y-0.5 hover:border-accent/50 hover:bg-accent/10 hover:text-foreground"
                      >
                        <Icon className="h-5 w-5" />
                      </a>
                    </li>
                  );
                })}
                {email ? (
                  <li>
                    <EmailIconLink email={email} />
                  </li>
                ) : null}
              </ul>
            )}
          </div>

          <div className="lg:col-span-7">
            <ContactForm />
          </div>
        </div>

        <SocialLinksEditor socialLinks={socialLinks} />
        <MessagesEditor />
      </div>
    </Section>
  );
}