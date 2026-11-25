import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, GraduationCap, Quote } from "lucide-react";
import HashLink from "@/components/common/HashLink";
import Magnetic from "@/components/effects/Magnetic";
import HeroRoleTypewriter from "@/components/effects/HeroRoleTypewriter";
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
const ROLE_TYPEWRITER = "FULL STACK DEVELOPER";

function degreeShort(degree: string): string {
  return degree.match(/\(([^)]+)\)/)?.[1] ?? degree;
}

export default function HeroSection({ profile, socialLinks, education }: Props) {
  const interactive = useInteractiveMotion();
  const { x: px, y: py } = useMouseParallax(interactive);
  const { scrollY } = useScroll();
  const scrollHint = useTransform(scrollY, [0, 140], [1, 0]);

  /** Portrait and peach disc share one transform so the halo stays centered on the photo. */
  const photoX = useTransform(px, (v) => v * 5);
  const photoY = useTransform(py, (v) => v * 3);

  const fullName = profile?.name ?? SITE.name;
  const firstName = fullName.split(" ")[0];
  const roleLine = publicRole(profile?.designation).toUpperCase();

  const socials = iconSocialLinks(socialLinks);
  const edu = education[0];
  /** Hero uses the cutout asset so the peach disc stays centered; full uploads may be rectangular. */
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
    <section className="relative isolate overflow-x-clip pb-4">
      <HeroTechMesh />
      <div className="relative mx-auto max-w-7xl px-4 pb-2 pt-10 text-center sm:pt-12 md:px-6 md:pt-14 lg:px-8 lg:pt-16">
        <header className="mx-auto flex max-w-3xl flex-col items-center gap-2 sm:gap-3">
          <h1 className="w-full font-display text-[2rem] font-extrabold leading-[1.12] tracking-tight text-foreground sm:text-5xl md:text-6xl">
            <SplitText
              text={`I'm ${firstName},`}
              highlight={[firstName]}
              whenInView={false}
              delay={0.1}
              className="block w-full text-center text-foreground"
            />
          </h1>
          <HeroRoleTypewriter text={roleLine || ROLE_TYPEWRITER} charMs={100} />
        </header>

        <div className="relative mx-auto mt-5 w-full max-w-6xl sm:mt-8">
          <div className="grid items-center gap-6 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:gap-8 xl:gap-10">
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.55, duration: 0.55 }}
              className="hidden text-left lg:block lg:max-w-[16rem] xl:max-w-[18rem]"
            >
              {quote}
            </motion.div>

            <div className="relative mx-auto w-full max-w-[18.5rem] sm:max-w-[22.5rem] lg:w-[24.5rem] lg:max-w-[24.5rem] xl:w-[26rem] xl:max-w-[26rem]">
              <div className="relative mx-auto h-[min(22.5rem,calc(100svh-16.5rem))] w-full sm:h-[min(28rem,calc(100svh-17rem))] lg:h-[min(30rem,calc(100svh-18rem))]">
                <motion.div
                  style={{ x: photoX, y: photoY }}
                  className="absolute inset-0 mx-auto w-full max-w-full"
                >
                  <div className="relative h-full w-full">
                    <motion.div
                      aria-hidden
                      initial={{ scale: 0.94, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.8, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
                      className="pointer-events-none absolute left-1/2 top-[44%] z-0 aspect-square w-[86%] -translate-x-1/2 -translate-y-1/2 sm:top-[45%] sm:w-[88%]"
                    >
                      <div className="absolute -inset-[7px] rounded-full border border-[rgb(var(--c-peach)/0.95)] opacity-90" />
                      <div className="absolute inset-0 rounded-full bg-[rgb(var(--c-peach))] shadow-[0_0_0_1px_rgb(var(--c-peach)/0.35)]" />
                    </motion.div>

                    <motion.img
                      src={portrait}
                      alt={`Portrait of ${fullName}`}
                      width={768}
                      height={951}
                      sizes="(min-width: 1024px) 26rem, (min-width: 640px) 22.5rem, 18.5rem"
                      loading="eager"
                      fetchPriority="high"
                      decoding="async"
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.85, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute inset-x-0 bottom-0 z-[1] mx-auto h-[94%] w-full max-w-full select-none object-contain object-bottom drop-shadow-[0_10px_24px_rgba(43,27,24,0.07)]"
                      draggable={false}
                    />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.75, duration: 0.5 }}
                  className="absolute inset-x-0 bottom-2 z-20 flex flex-col items-stretch gap-2 px-1 sm:bottom-4 sm:flex-row sm:justify-center sm:gap-3 sm:px-0"
                >
                  <Magnetic className="sm:w-auto">
                    <HashLink
                      id="resume"
                      className="btn-primary group w-full justify-center sm:min-w-[9rem] sm:w-auto"
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
                      className="btn-ghost w-full justify-center !bg-white sm:min-w-[9rem] sm:w-auto"
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
              transition={{ delay: 0.65, duration: 0.55 }}
              className="hidden text-right lg:block lg:justify-self-end lg:max-w-[16rem] xl:max-w-[18rem]"
            >
              {stats}
            </motion.div>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-xl gap-8 px-4 pb-10 pt-8 text-left sm:grid-cols-2 sm:px-6 lg:hidden">
        {quote}
        <div className="sm:text-right">{stats}</div>
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