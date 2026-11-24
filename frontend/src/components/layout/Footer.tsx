import { Github, Linkedin, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { SITE } from "@/constants/site";
import type { SocialLink } from "@/types/portfolio";

const iconFor = (platform: string) => {
  const p = platform.toLowerCase();
  if (p.includes("github")) return Github;
  if (p.includes("linkedin")) return Linkedin;
  if (p.includes("mail") || p.includes("email")) return Mail;
  return Mail;
};

type Props = {
  socialLinks: SocialLink[];
  email?: string | null;
};

export default function Footer({ socialLinks, email }: Props) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-surface/50">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 md:flex-row md:items-center md:justify-between md:px-6">
        <div>
          <p className="font-semibold">{SITE.name}</p>
          <p className="mt-1 text-sm text-muted">{SITE.headline}</p>
          <p className="mt-4 text-xs text-muted">
            © {year} {SITE.name}. All rights reserved.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {socialLinks.map((link) => {
            const Icon = iconFor(link.platform);
            return (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-muted transition hover:border-accent/40 hover:text-foreground"
                aria-label={link.label}
              >
                <Icon className="h-4 w-4" />
                <span>{link.label}</span>
              </a>
            );
          })}
          {email ? (
            <a
              href={`mailto:${email}`}
              className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-muted transition hover:border-accent/40 hover:text-foreground"
            >
              <Mail className="h-4 w-4" />
              Email
            </a>
          ) : null}
          <Link
            to="/admin/login"
            className="text-xs text-muted/70 transition hover:text-muted"
          >
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}