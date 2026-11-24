import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { ArrowUpRight, Download, GraduationCap, Layers, Mail, Quote } from "lucide-react";
import HashLink from "@/components/common/HashLink";
import Magnetic from "@/components/effects/Magnetic";
import SplitText from "@/components/effects/SplitText";
import { SITE } from "@/constants/site";
import { useInteractiveMotion } from "@/hooks/useInteractiveMotion";
import { useMouseParallax } from "@/hooks/useMouseParallax";
import type { Education, Profile, Resume, Skill, SocialLink } from "@/types/portfolio";
import { formatYearRange } from "@/utils/format";
import { mediaUrl } from "@/utils/mediaUrl";
import { socialIcon, sortedSocials } from "@/utils/social";

type Props = {
  profile: Profile | null;
  skills: Skill[];
  socialLinks: SocialLink[];
  resume: Resume | null;
  education: Education[];
  projectCount: number;
};

/** Default portrait. Replaced by the owner-uploaded photo when one exists. */
const FALLBACK_PORTRAIT = "/images/pooja-portrait.webp";

const BADGE_SLOTS = [
  { style: { top: "10%", left: "20%" }, depth: 22, delay: "0s" },
  { style: { top: "26%", right: "18%" }, depth: -18, delay: "1.2s" },
  { style: { top: "54%", left: "16%" }, depth: 16, delay: "2s" },
  { style: { top: "62%", right: "15%" }, depth: -24, delay: "0.6s" },
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
        <span className="glass-panel inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold">
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
  resume,
  education,
  projectCount,
}: Props) {
  const interactive = useInteractiveMotion();
  const { x: px, y: py } = useMouseParallax(interactive);
  const { scrollY } = useScroll();
  const scrollHint = useTransform(scrollY, [0, 140], [1, 0]);

  const photoX = useTransform(px, (v) => v * 8);
  const photoY = useTransform(py, (v) => v * 5);
  const discX = useTransform(px, (v) => v * -14);
  const discY = useTransform(py, (v) => v * -8);

  const fullName = profile?.name ?? SITE.name;
  const firstName = fullName.split(" ")[0];
  const roles = (profile?.designation ?? SITE.headline)
    .split("|")
    .map((s) => s.trim())
    .filter(Boolean);
  const role = roles[0] ?? "Python Backend Developer";
  // Badges: Python + FastAPI first (when they appear in the headline or skills), then other real skills.
  const headline = profile?.designation ?? SITE.headline;
  const skillNames = skills.map((s) => s.name);
  const core = ["Python", "FastAPI"].filter(
    (t) =>
      headline.toLowerCase().includes(t.toLowerCase()) ||
      skillNames.some((n) => n.toLowerCase() === t.toLowerCase()),
  );
  const badges = [
    ...core,
    ...skillNames.filter((n) => !core.some((c) => c.toLowerCase() === n.toLowerCase())),
  ].slice(0, BADGE_SLOTS.length);
  const socials = sortedSocials(socialLinks);
  const edu = education[0];

  const portrait = profile?.profile_image_url ?? FALLBACK_PORTRAIT;
  // Uploaded photos usually keep a white backdrop; multiply lets it melt into the peach disc.
  const portraitBlend = profile?.profile_image_url ? "mix-blend-multiply" : "";

  const iconBtn =
    "flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted transition duration-300 hover:-translate-y-1 hover:border-accent/60 hover:bg-accent/10 hover:text-foreground";

  const quote = (
    <div className="max-w-xs">
      <Quote className="h-7 w-7 fill-accent text-accent" aria-hidden />
      <p className="mt-3 text-sm leading-relaxed text-foreground/80">
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
    <div className="space-y-5">
      {edu ? (
        <div>
          <div className="flex items-center gap-2 lg:justify-end">
            <GraduationCap className="h-5 w-5 text-accent" aria-hidden />
            <p className="font-display text-3xl font-extrabold leading-none md:text-4xl">
              {degreeShort(edu.degree)}
            </p>
          </div>
          <p className="mt-1.5 text-xs font-medium text-muted">
            Education · {formatYearRange(edu.start_year, edu.end_year)}
          </p>
        </div>
      ) : null}
      {projectCount > 0 ? (
        <div>
          <div className="flex items-center gap-2 lg:justify-end">
            <Layers className="h-5 w-5 text-accent" aria-hidden />
            <p className="font-display text-3xl font-extrabold leading-none md:text-4xl">
              {projectCount}
            </p>
          </div>
          <p className="mt-1.5 text-xs font-medium text-muted">Projects published</p>
        </div>
      ) : null}
    </div>
  );

  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-6xl px-4 pt-10 text-center md:px-6 md:pt-14">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-panel inline-flex items-center gap-2.5 rounded-full px-4 py-1.5 text-xs font-semibold"
        >
          <span className="relative flex h-2 w-2" aria-hidden>
            <span className="absolute inset-0 animate-ping-slow rounded-full bg-emerald-500" />
            <span className="relative h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          Open to opportunities
        </motion.span>

        <div className="relative mt-6">
          {/* Hand-drawn accent strokes */}
          <svg
            aria-hidden
            viewBox="0 0 60 50"
            className="pointer-events-none absolute -top-2 left-[6%] hidden h-14 w-16 text-accent lg:block"
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

          <h1 className="font-display text-[2.4rem] font-extrabold leading-[1.04] tracking-tight sm:text-6xl lg:text-7xl">
            <SplitText
              text={`I'm ${firstName},`}
              highlight={[firstName]}
              whenInView={false}
              delay={0.1}
              className="block"
            />
            <SplitText text={role} whenInView={false} delay={0.3} className="block" />
          </h1>
        </div>

        {/* Portrait stage */}
        <div className="relative mx-auto mt-8 h-[27rem] w-full max-w-5xl sm:h-[31rem] lg:h-[35rem]">
          <div className="absolute inset-0 overflow-hidden">
            {/* Peach disc */}
            <div className="absolute bottom-0 left-1/2 w-[min(35rem,94vw)] -translate-x-1/2 translate-y-[36%]">
              <motion.div
                style={{ x: discX, y: discY }}
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="aspect-square w-full rounded-full bg-[rgb(var(--c-peach))]"
              />
            </div>
            {/* Thin decorative outline around the disc */}
            <div
              aria-hidden
              className="absolute bottom-0 left-1/2 w-[min(40rem,104vw)] -translate-x-1/2 translate-y-[38%]"
            >
              <div className="aspect-square w-full rounded-full border border-accent/25" />
            </div>

            {/* Portrait */}
            <div className="absolute bottom-0 left-1/2 h-[94%] -translate-x-1/2">
              <motion.img
                src={portrait}
                alt={`Portrait of ${fullName}`}
                width={768}
                height={962}
                loading="eager"
                style={{ x: photoX, y: photoY }}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className={`h-full w-auto max-w-none select-none object-contain object-bottom ${portraitBlend}`}
                draggable={false}
              />
            </div>
          </div>

          {/* Gently floating decorative circles */}
          <div
            aria-hidden
            className="absolute left-[27%] top-[42%] hidden h-5 w-5 animate-float rounded-full bg-accent-2 lg:block"
          />
          <div
            aria-hidden
            className="absolute right-[26%] top-[14%] hidden h-9 w-9 animate-float rounded-full border-2 border-accent/50 lg:block"
            style={{ animationDelay: "1.4s" }}
          />
          <div
            aria-hidden
            className="absolute right-[31%] top-[48%] hidden h-3 w-3 animate-float rounded-full bg-accent lg:block"
            style={{ animationDelay: "0.8s" }}
          />

          {/* Floating badges (real skills) */}
          {badges.map((label, i) => (
            <FloatingBadge key={`${label}-${i}`} label={label} slot={BADGE_SLOTS[i]} px={px} py={py} />
          ))}

          {/* Side blocks (desktop) */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7, duration: 0.7 }}
            className="absolute left-0 top-[18%] z-10 hidden text-left lg:block"
          >
            {quote}
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 0.7 }}
            className="absolute right-0 top-[18%] z-10 hidden text-right lg:block"
          >
            {stats}
          </motion.div>

          {/* Buttons overlapping the portrait */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="absolute inset-x-0 bottom-5 z-20 flex flex-wrap items-center justify-center gap-3"
          >
            <Magnetic>
              <HashLink id="projects" className="btn-primary group">
                Portfolio
                <ArrowUpRight
                  className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  aria-hidden
                />
              </HashLink>
            </Magnetic>
            <Magnetic>
              <HashLink id="contact" className="btn-ghost !bg-white !text-[#2B1B18]">
                Hire Me
              </HashLink>
            </Magnetic>
            {resume ? (
              <Magnetic>
                <a
                  href={mediaUrl(resume.file_url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost group !bg-white !text-[#2B1B18]"
                >
                  <Download
                    className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5"
                    aria-hidden
                  />
                  Resume
                </a>
              </Magnetic>
            ) : null}
          </motion.div>
        </div>
      </div>

      {/* Quote + stats below the stage on tablet / mobile */}
      <div className="mx-auto grid max-w-xl gap-8 px-6 pb-14 pt-10 text-left sm:grid-cols-2 lg:hidden">
        {quote}
        <div className="sm:text-right">{stats}</div>
      </div>

      {/* Scroll indicator */}
      <motion.div style={{ opacity: scrollHint }} className="hidden justify-center pb-6 pt-8 lg:flex">
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