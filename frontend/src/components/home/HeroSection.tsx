import { motion, useScroll, useTransform } from "framer-motion";
import type { ReactNode } from "react";
import { ArrowUpRight, Crosshair, GraduationCap, Quote, Sparkles, Star } from "lucide-react";
import HashLink from "@/components/common/HashLink";
import Magnetic from "@/components/effects/Magnetic";
import HeroTechMesh from "@/components/effects/HeroTechMesh";
import SplitText from "@/components/effects/SplitText";
import { publicRole, SITE } from "@/constants/site";
import { useInteractiveMotion } from "@/hooks/useInteractiveMotion";
import { useMouseParallax } from "@/hooks/useMouseParallax";
import type { Education, Profile, Resume, SocialLink } from "@/types/portfolio";
import { formatYearRange } from "@/utils/format";
import { iconSocialLinks, socialIcon } from "@/utils/social";
import EmailIconLink from "@/components/common/EmailIconLink";

type Props = {
  profile: Profile | null;
  socialLinks: SocialLink[];
  resume: Resume | null;
  education: Education[];
};

const FALLBACK_PORTRAIT = "/images/pooja-portrait.webp?v=pro-sharp-1";

function degreeShort(degree: string): string {
  return degree.match(/\(([^)]+)\)/)?.[1] ?? degree;
}

function HeroPill({ children, icon }: { children: string; icon?: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-border bg-white/92 px-4 py-2 text-xs font-semibold text-foreground shadow-[0_4px_14px_rgb(43_27_24/0.06)] backdrop-blur-sm">
      {icon}
      {children}
    </span>
  );
}

export default function HeroSection({ profile, socialLinks, education }: Props) {
  const interactive = useInteractiveMotion();
  const { x: px, y: py } = useMouseParallax(interactive);
  const { scrollY } = useScroll();
  const scrollHint = useTransform(scrollY, [0, 140], [1, 0]);

  const photoX = useTransform(px, (v) => v * 4);
  const photoY = useTransform(py, (v) => v * 2.5);

  const fullName = profile?.name ?? SITE.name;
  const firstName = fullName.split(" ")[0];
  const subtitleRole = profile?.designation?.trim() || publicRole(profile?.designation);

  const socials = iconSocialLinks(socialLinks);
  const edu = education[0];
  const portrait = (() => {
    const remote = profile?.profile_image_url;
    if (remote?.includes("pooja-portrait")) return remote;
    return FALLBACK_PORTRAIT;
  })();

  const iconBtn =
    "flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-white/80 text-muted transition duration-300 hover:-translate-y-0.5 hover:border-accent/50 hover:bg-accent/10 hover:text-foreground";

  const quote = (
    <div className="max-w-[15rem]">
      <Quote className="h-6 w-6 fill-accent/20 text-accent" aria-hidden />
      <p className="mt-3 text-sm leading-relaxed text-muted">
        I build scalable backend systems, modern applications and meaningful digital experiences.
      </p>
      {socials.length > 0 || profile?.email ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {socials.map((l) => {
            const Icon = socialIcon(l.platform);
            return (
              <a
                key={l.id}
                href={l.url}
                target="_blank"
                rel="noopener noreferrer"
                className={iconBtn}
                aria-label={l.label}
              >
                <Icon className="h-4 w-4" />
              </a>
            );
          })}
          {profile?.email ? <EmailIconLink email={profile.email} size="sm" /> : null}
        </div>
      ) : null}
    </div>
  );

  const stats = (
    <div>
      {edu ? (
        <div>
          <div className="flex items-center gap-2 lg:justify-end">
            <GraduationCap className="h-5 w-5 text-accent" aria-hidden />
            <p className="font-display text-3xl font-extrabold leading-none text-foreground md:text-4xl">
              {degreeShort(edu.degree)}
            </p>
          </div>
          <p className="mt-1.5 text-xs font-medium text-muted">
            Education · {formatYearRange(edu.start_year, edu.end_year)}
          </p>
        </div>
      ) : null}
    </div>
  );

  return (
    <section className="relative isolate overflow-x-clip pb-6">
      <HeroTechMesh />
      <div className="relative mx-auto max-w-7xl px-4 pt-8 text-center sm:pt-10 md:px-6 md:pt-12 lg:px-8 lg:pt-14">
        <header className="relative mx-auto flex max-w-3xl flex-col items-center gap-2 sm:gap-2.5">
          <Sparkles
            className="absolute -left-1 top-1 h-5 w-5 text-accent sm:-left-6 md:-left-10 lg:-left-14"
            aria-hidden
          />
          <h1 className="w-full font-display text-[2.15rem] font-extrabold leading-[1.1] tracking-tight text-foreground sm:text-5xl md:text-[3.35rem]">
            <SplitText
              text={`I'm ${firstName},`}
              highlight={[firstName]}
              whenInView={false}
              delay={0.1}
              className="block w-full text-center text-foreground"
            />
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.32, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-base font-bold text-foreground sm:text-xl md:text-2xl"
          >
            {subtitleRole}
          </motion.p>
        </header>

        <div className="relative mx-auto mt-8 w-full max-w-6xl sm:mt-10 lg:mt-12">
          <Crosshair
            className="pointer-events-none absolute right-[2%] top-[42%] z-10 hidden h-5 w-5 text-accent lg:block xl:right-[0%]"
            aria-hidden
          />

          <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:gap-6 xl:gap-12">
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.55 }}
              className="hidden flex-col items-start gap-12 lg:flex lg:max-w-[17rem] xl:max-w-[18rem]"
            >
              {quote}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.72, duration: 0.45 }}
                className="-mt-2"
              >
                <HeroPill icon={<Star className="h-3.5 w-3.5 text-accent" aria-hidden />}>FastAPI</HeroPill>
              </motion.div>
            </motion.div>

            <div className="relative mx-auto w-full max-w-[19rem] sm:max-w-[23rem] lg:w-[27rem] lg:max-w-[27rem] xl:w-[29rem] xl:max-w-[29rem]">
              <div className="relative mx-auto h-[min(24rem,calc(100svh-15rem))] w-full sm:h-[min(29rem,calc(100svh-16rem))] lg:h-[min(31rem,calc(100svh-17.5rem))]">
                <motion.div
                  style={{ x: photoX, y: photoY }}
                  className="absolute inset-0 overflow-hidden rounded-b-[2.75rem] sm:rounded-b-[3.25rem]"
                >
                  <div className="relative h-full w-full">
                    <motion.div
                      aria-hidden
                      initial={{ scale: 0.93, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.85, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                      className="pointer-events-none absolute left-1/2 top-[46%] z-0 aspect-square w-[94%] -translate-x-1/2 -translate-y-1/2"
                    >
                      <div className="absolute -inset-2 rounded-full border-2 border-[rgb(var(--c-peach)/0.85)] opacity-95" />
                      <div className="absolute inset-0 rounded-full bg-[rgb(var(--c-peach))]" />
                    </motion.div>

                    <motion.img
                      src={portrait}
                      alt={`Portrait of ${fullName}`}
                      width={768}
                      height={951}
                      sizes="(min-width: 1024px) 29rem, (min-width: 640px) 23rem, 19rem"
                      loading="eager"
                      fetchPriority="high"
                      decoding="async"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.85, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute inset-x-0 bottom-0 z-[1] mx-auto h-[96%] w-full max-w-full select-none object-contain object-bottom drop-shadow-[0_12px_28px_rgba(43,27,24,0.08)]"
                      draggable={false}
                    />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.78, duration: 0.5 }}
                  className="absolute inset-x-0 bottom-3 z-20 flex flex-col items-stretch justify-center gap-2.5 px-2 sm:bottom-5 sm:flex-row sm:gap-3"
                >
                  <Magnetic className="sm:w-auto">
                    <HashLink
                      id="resume"
                      className="btn-primary group w-full justify-center sm:min-w-[9.25rem] sm:w-auto"
                    >
                      Portfolio
                      <ArrowUpRight
                        className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        aria-hidden
                      />
                    </HashLink>
                  </Magnetic>
                  <Magnetic className="sm:w-auto">
                    <HashLink
                      id="contact"
                      className="btn-ghost w-full justify-center !bg-white sm:min-w-[9.25rem] sm:w-auto"
                    >
                      Hire Me
                    </HashLink>
                  </Magnetic>
                </motion.div>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.58, duration: 0.55 }}
              className="hidden flex-col items-end gap-10 lg:flex lg:max-w-[17rem] xl:max-w-[18rem]"
            >
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.68, duration: 0.45 }}
              >
                <HeroPill>{SITE.headline}</HeroPill>
              </motion.div>
              {stats}
            </motion.div>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-xl gap-8 px-4 pb-10 pt-8 text-left sm:grid-cols-2 sm:px-6 lg:hidden">
        {quote}
        <div className="space-y-6 sm:text-right">
          <HeroPill>{SITE.headline}</HeroPill>
          {stats}
        </div>
      </div>

      <motion.div style={{ opacity: scrollHint }} className="hidden justify-center pb-4 pt-2 lg:flex">
        <HashLink
          id="about"
          className="flex flex-col items-center gap-2 text-[10px] font-semibold uppercase tracking-label text-muted transition hover:text-foreground"
          aria-label="Scroll to about section"
        >
          Scroll
          <span className="flex h-9 w-5 justify-center rounded-full border border-border pt-1.5">
            <span className="h-1.5 w-1 animate-scroll-dot rounded-full bg-accent" />
          </span>
        </HashLink>
      </motion.div>
    </section>
  );
}