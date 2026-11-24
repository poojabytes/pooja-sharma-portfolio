import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { ArrowUpRight, GraduationCap, Mail, Quote } from "lucide-react";
import HashLink from "@/components/common/HashLink";
import Magnetic from "@/components/effects/Magnetic";
import SplitText from "@/components/effects/SplitText";
import { SITE } from "@/constants/site";
import { useInteractiveMotion } from "@/hooks/useInteractiveMotion";
import { useMouseParallax } from "@/hooks/useMouseParallax";
import type { Education, Profile, Resume, Skill, SocialLink } from "@/types/portfolio";
import { formatYearRange } from "@/utils/format";
import { socialIcon, sortedSocials } from "@/utils/social";

type Props = {
  profile: Profile | null;
  skills: Skill[];
  socialLinks: SocialLink[];
  resume: Resume | null;
  education: Education[];
  projectCount: number;
};

/** Transparent cutout portrait. Replaced when an owner upload exists. */
const FALLBACK_PORTRAIT = "/images/pooja-portrait.webp?v=hair-clean-2";

const BADGE_SLOTS = [
  { style: { top: "22%", left: "18%" }, depth: 18, delay: "0s" },
  { style: { top: "18%", right: "16%" }, depth: -16, delay: "1.1s" },
] as const;

function FloatingBadge({
  label,
  slot,
  px,
  py,
}: {
  label: string;
  slot: (typeof BADGE_SLOTS)[number];
  px: MotionValue<number>;
  py: MotionValue<number>;
}) {
  const x = useTransform(px, (v) => v * slot.depth);
  const y = useTransform(py, (v) => v * slot.depth);
  return (
    <motion.div
      style={{ ...slot.style, x, y }}
      className="absolute z-20 hidden lg:block"
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1, type: "spring", stiffness: 180, damping: 16 }}
    >
      <div className="animate-float" style={{ animationDelay: slot.delay }}>
        <span className="glass-panel inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold shadow-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
          {label}
        </span>
      </div>
    </motion.div>
  );
}

function degreeShort(degree: string): string {
  return degree.match(/\(([^)]+)\)/)?.[1] ?? degree;
}

export default function HeroSection({
  profile,
  skills,
  socialLinks,
  education,
}: Props) {
  const interactive = useInteractiveMotion();
  const { x: px, y: py } = useMouseParallax(interactive);
  const { scrollY } = useScroll();
  const scrollHint = useTransform(scrollY, [0, 140], [1, 0]);

  const photoX = useTransform(px, (v) => v * 8);
  const photoY = useTransform(py, (v) => v * 5);
  const discX = useTransform(px, (v) => v * -12);
  const discY = useTransform(py, (v) => v * -7);

  const fullName = profile?.name ?? SITE.name;
  const firstName = fullName.split(" ")[0];
  // Hero title matches the premium reference layout.
  const role = "Python Backend Developer";

  const skillNames = skills.map((s) => s.name);
  const has = (name: string) => skillNames.some((n) => n.toLowerCase() === name.toLowerCase());
  const badges = [
    has("FastAPI") ? "FastAPI" : "Python",
    "Full Stack Developer",
  ].slice(0, BADGE_SLOTS.length);

  const socials = sortedSocials(socialLinks);
  const edu = education[0];
  const portrait = profile?.profile_image_url ?? FALLBACK_PORTRAIT;
  const portraitBlend = profile?.profile_image_url ? "mix-blend-multiply" : "";

  const iconBtn =
    "flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white/70 text-muted transition duration-300 hover:-translate-y-1 hover:border-accent/60 hover:bg-accent/10 hover:text-foreground";

  const quote = (
    <div className="max-w-[15rem]">
      <Quote className="h-7 w-7 fill-accent text-accent" aria-hidden />
      <p className="mt-3 text-sm leading-relaxed text-muted">
        I build scalable backend systems, modern applications and meaningful digital experiences.
      </p>
      {socials.length > 0 || profile?.email ? (
        <div className="mt-4 flex gap-2">
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
          {profile?.email ? (
            <a href={`mailto:${profile.email}`} className={iconBtn} aria-label="Send email">
              <Mail className="h-4 w-4" />
            </a>
          ) : null}
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
      <div className="mx-auto max-w-6xl px-4 pt-8 text-center sm:pt-10 md:px-6 md:pt-12">
        <div className="relative">
          <svg
            aria-hidden
            viewBox="0 0 60 50"
            className="pointer-events-none absolute -top-1 left-[8%] hidden h-12 w-14 text-accent lg:block"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          >
            <path d="M8 38 C 14 30, 18 22, 22 8" pathLength={1} strokeDasharray={1} className="animate-draw" />
            <path
              d="M22 42 C 28 34, 34 28, 46 20"
              pathLength={1}
              strokeDasharray={1}
              className="animate-draw"
              style={{ animationDelay: "0.3s" }}
            />
            <path
              d="M34 46 C 42 42, 48 40, 56 38"
              pathLength={1}
              strokeDasharray={1}
              className="animate-draw"
              style={{ animationDelay: "0.6s" }}
            />
          </svg>

          <h1 className="mx-auto max-w-3xl font-display text-[2rem] font-extrabold leading-[1.1] tracking-tight text-foreground sm:text-5xl md:text-6xl">
            <SplitText
              text={`I'm ${firstName},`}
              highlight={[firstName]}
              whenInView={false}
              delay={0.1}
              className="block"
            />
            <SplitText text={role} whenInView={false} delay={0.28} className="block" />
          </h1>
        </div>

        {/* Portrait stage */}
        <div className="relative mx-auto mt-8 w-full max-w-5xl overflow-x-clip">
          <div className="relative mx-auto h-[23rem] w-full max-w-[24rem] sm:h-[30rem] sm:max-w-[30rem] lg:h-[34rem] lg:max-w-5xl">
            <div className="absolute inset-0">
              {/* Soft peach circle behind the cutout */}
              <div className="absolute bottom-[-8%] left-1/2 w-[min(34rem,92%)] -translate-x-1/2">
                <motion.div
                  style={{ x: discX, y: discY }}
                  initial={{ scale: 0.78, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                  className="relative aspect-square w-full"
                >
                  <div className="absolute inset-0 rounded-full bg-[rgb(var(--c-peach))]" />
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -inset-[3%] rounded-full border border-accent/20"
                  />
                </motion.div>
              </div>

              {/* Cutout portrait with clear hair silhouette */}
              <div className="absolute bottom-0 left-1/2 z-[1] h-[97%] -translate-x-1/2">
                <motion.img
                  src={portrait}
                  alt={`Portrait of ${fullName}`}
                  width={768}
                  height={962}
                  loading="eager"
                  style={{ x: photoX, y: photoY }}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className={`h-full w-auto max-w-none select-none object-contain object-bottom drop-shadow-[0_12px_20px_rgba(43,27,24,0.08)] ${portraitBlend}`}
                  draggable={false}
                />
              </div>
            </div>

            {/* Soft decorative dots */}
            <div
              aria-hidden
              className="absolute left-[28%] top-[44%] hidden h-4 w-4 animate-float rounded-full bg-accent-2 lg:block"
            />
            <div
              aria-hidden
              className="absolute right-[27%] top-[16%] hidden h-8 w-8 animate-float rounded-full border-2 border-accent/40 lg:block"
              style={{ animationDelay: "1.3s" }}
            />

            {badges.map((label, i) => (
              <FloatingBadge key={`${label}-${i}`} label={label} slot={BADGE_SLOTS[i]} px={px} py={py} />
            ))}

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.65, duration: 0.65 }}
              className="absolute left-0 top-[20%] z-10 hidden text-left lg:block"
            >
              {quote}
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.75, duration: 0.65 }}
              className="absolute right-0 top-[22%] z-10 hidden text-right lg:block"
            >
              {stats}
            </motion.div>

            {/* Reference-style CTAs overlapping the lower circle */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.85, duration: 0.55 }}
              className="absolute inset-x-0 bottom-5 z-20 flex flex-wrap items-center justify-center gap-3"
            >
              <Magnetic>
                <HashLink id="projects" className="btn-primary group min-w-[9rem] shadow-lg shadow-accent/20">
                  Portfolio
                  <ArrowUpRight
                    className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    aria-hidden
                  />
                </HashLink>
              </Magnetic>
              <Magnetic>
                <HashLink id="contact" className="btn-ghost min-w-[9rem] !bg-white shadow-md shadow-black/5">
                  Hire Me
                </HashLink>
              </Magnetic>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Mobile / tablet supporting content */}
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
