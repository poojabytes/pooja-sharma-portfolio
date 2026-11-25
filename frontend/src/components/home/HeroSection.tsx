import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, GraduationCap, Quote } from "lucide-react";
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

export default function HeroSection({ profile, socialLinks, education }: Props) {
  const interactive = useInteractiveMotion();
  const { x: px, y: py } = useMouseParallax(interactive);
  const { scrollY } = useScroll();
  const scrollHint = useTransform(scrollY, [0, 140], [1, 0]);

  /** Portrait + peach disc move together so the halo stays centered on every screen size. */
  const photoX = useTransform(px, (v) => v * 5);
  const photoY = useTransform(py, (v) => v * 3);

  const fullName = profile?.name ?? SITE.name;
  const firstName = fullName.split(" ")[0];
  const role = publicRole(profile?.designation);

  const socials = iconSocialLinks(socialLinks);
  const edu = education[0];
  const portrait = profile?.profile_image_url ?? FALLBACK_PORTRAIT;
  const portraitBlend = profile?.profile_image_url ? "mix-blend-multiply" : "";

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
    <section className="relative overflow-hidden pb-4">
      <HeroTechMesh />
      <div className="relative mx-auto max-w-7xl px-4 pt-8 text-center sm:pt-10 md:px-6 md:pt-12 lg:px-8">
        <h1 className="mx-auto flex max-w-3xl flex-col items-center gap-1 px-2 text-center font-display text-[2rem] font-extrabold leading-[1.12] tracking-tight text-foreground sm:gap-2 sm:text-5xl md:text-6xl">
          <SplitText
            text={`I'm ${firstName},`}
            highlight={[firstName]}
            whenInView={false}
            delay={0.1}
            className="block w-full text-center"
          />
          <SplitText
            text={role}
            whenInView={false}
            delay={0.28}
            className="block w-full max-w-[18ch] text-center text-[1.55rem] leading-tight sm:max-w-none sm:text-[inherit]"
          />
        </h1>

        <div className="relative mx-auto mt-6 w-full max-w-6xl overflow-x-clip sm:mt-8">
          <div className="grid items-end gap-8 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:gap-6 xl:gap-10">
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.55, duration: 0.55 }}
              className="hidden pb-32 text-left lg:block lg:max-w-[16rem] xl:max-w-[18rem]"
            >
              {quote}
            </motion.div>

            <div className="relative mx-auto w-full max-w-[21rem] sm:max-w-[27rem] lg:w-[26rem] lg:max-w-[26rem] xl:w-[28rem] xl:max-w-[28rem]">
              <div className="relative h-[23rem] sm:h-[29rem] lg:h-[32rem] xl:h-[34rem]">
                <motion.div
                  style={{ x: photoX, y: photoY }}
                  className="absolute inset-0 flex items-end justify-center"
                >
                  <div className="relative h-[94%] w-[82%]">
                    <motion.div
                      aria-hidden
                      initial={{ scale: 0.92, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.8, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute bottom-[2%] left-1/2 z-0 aspect-square w-full -translate-x-1/2 rounded-full bg-[rgb(var(--c-peach))]"
                    />

                    <motion.img
                      src={portrait}
                      alt={`Portrait of ${fullName}`}
                      width={768}
                      height={951}
                      sizes="(min-width: 1024px) 28rem, (min-width: 640px) 27rem, 21rem"
                      loading="eager"
                      fetchPriority="high"
                      decoding="async"
                      initial={{ opacity: 0, y: 32 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.85, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
                      className={`relative z-[1] mx-auto h-full w-full select-none object-contain object-bottom drop-shadow-[0_10px_24px_rgba(43,27,24,0.07)] ${portraitBlend}`}
                      draggable={false}
                    />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.75, duration: 0.5 }}
                  className="absolute inset-x-0 bottom-3 z-20 flex flex-col items-stretch gap-2 px-1 sm:bottom-5 sm:flex-row sm:justify-center sm:gap-3 sm:px-0"
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
              className="hidden pb-32 text-right lg:block lg:justify-self-end lg:max-w-[16rem] xl:max-w-[18rem]"
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