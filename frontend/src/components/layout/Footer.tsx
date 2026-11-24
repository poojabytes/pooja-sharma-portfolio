import { ArrowUp, Mail } from "lucide-react";
import Magnetic from "@/components/effects/Magnetic";
import { requestOwnerLogin } from "@/components/owner/OwnerToolbar";
import { SITE } from "@/constants/site";
import { useAuth } from "@/context/AuthContext";
import { iconSocialLinks, socialIcon } from "@/utils/social";
import type { SocialLink } from "@/types/portfolio";

type Props = {
  socialLinks: SocialLink[];
  email?: string | null;
};

const iconBtn =
  "flex h-11 w-11 items-center justify-center rounded-xl border border-border text-muted transition hover:-translate-y-0.5 hover:border-accent/60 hover:bg-accent/10 hover:text-foreground";

export default function Footer({ socialLinks, email }: Props) {
  const year = new Date().getFullYear();
  const { isOwner } = useAuth();

  return (
    <footer className="relative mt-10 border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 md:flex-row md:items-end md:justify-between md:px-6">
        <div>
          <p className="font-display text-lg font-bold">{SITE.name}</p>
          <p className="mt-1 max-w-sm text-sm text-muted">
            Full-Stack Developer (MERN) · AI/ML Enthusiast
          </p>
          <p className="mt-6 text-xs text-muted">
            © {year} {SITE.name}. Built with React &amp; FastAPI.
            {!isOwner ? (
              <button
                type="button"
                onClick={requestOwnerLogin}
                className="ml-3 text-muted/50 transition hover:text-muted"
              >
                Owner
              </button>
            ) : null}
          </p>
        </div>

        <div className="flex w-full flex-wrap items-center gap-3 md:w-auto">
          {iconSocialLinks(socialLinks).map((link) => {
            const Icon = socialIcon(link.platform);
            return (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={iconBtn}
                aria-label={link.label}
              >
                <Icon className="h-4 w-4" />
              </a>
            );
          })}
          {email ? (
            <a href={`mailto:${email}`} className={iconBtn} aria-label="Send email">
              <Mail className="h-4 w-4" />
            </a>
          ) : null}
          <Magnetic>
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="btn-ghost group min-w-[10.5rem] flex-1 !px-6 sm:ml-2 sm:flex-none"
            >
              Back to top
              <ArrowUp
                className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-1"
                aria-hidden
              />
            </button>
          </Magnetic>
        </div>
      </div>
    </footer>
  );
}