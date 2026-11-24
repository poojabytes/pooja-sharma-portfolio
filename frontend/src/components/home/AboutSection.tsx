import { Briefcase, Code2, GraduationCap, MapPin, Sparkles } from "lucide-react";
import type { ReactNode } from "react";
import Section from "@/components/common/Section";
import SectionHeading from "@/components/common/SectionHeading";
import TiltCard from "@/components/effects/TiltCard";
import ProfileEditor from "@/components/owner/editors/ProfileEditor";
import type { Education, Experience, Profile, Skill } from "@/types/portfolio";
import { formatYearRange } from "@/utils/format";

type Props = {
  profile: Profile | null;
  education: Education[];
  experience: Experience[];
  skills: Skill[];
};

function BentoCard({
  className,
  label,
  icon,
  delay,
  children,
}: {
  className: string;
  label: string;
  icon: ReactNode;
  delay: number;
  children: ReactNode;
}) {
  return (
    <TiltCard delay={delay} max={5} className={`bento-card g-border ${className}`}>
      <div className="relative z-10 flex h-full flex-col">
        <div className="mb-5 flex items-center justify-between">
          <p className="label">{label}</p>
          <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-accent/10 text-accent transition-transform duration-700 group-hover:rotate-[360deg]">
            {icon}
          </span>
        </div>
        {children}
      </div>
    </TiltCard>
  );
}

export default function AboutSection({ profile, education, experience, skills }: Props) {
  const roles = (profile?.designation ?? "")
    .split("|")
    .map((s) => s.trim())
    .filter(Boolean);
  const edu = education[0];
  const current = experience.find((e) => e.is_current);
  const categories = [...new Set(skills.map((s) => s.category))];

  return (
    <Section id="about" tone="violet" side="left">
      <SectionHeading eyebrow="About" index="01" title="Who am I?" highlight={["am"]} />

      <div className="grid auto-rows-auto gap-4 md:grid-cols-12 md:grid-flow-dense">
        <BentoCard
          className="md:col-span-7 md:row-span-2"
          label="Introduction"
          icon={<Sparkles className="h-5 w-5" />}
          delay={0}
        >
          {profile?.biography ? (
            <p className="whitespace-pre-wrap text-lg leading-relaxed text-foreground/90 md:text-xl">
              {profile.biography}
            </p>
          ) : (
            <p className="text-muted">
              Your introduction will appear here once you add a biography.
            </p>
          )}
        </BentoCard>

        {roles.length > 0 ? (
          <BentoCard
            className="md:col-span-5"
            label="Professional identity"
            icon={<Code2 className="h-5 w-5" />}
            delay={0.08}
          >
            <ul className="space-y-2">
              {roles.map((r) => (
                <li key={r} className="flex items-center gap-3 font-display text-lg font-semibold">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
                  {r}
                </li>
              ))}
            </ul>
          </BentoCard>
        ) : null}

        {edu ? (
          <BentoCard
            className="md:col-span-5"
            label="Education"
            icon={<GraduationCap className="h-5 w-5" />}
            delay={0.12}
          >
            <p className="text-xs font-semibold uppercase tracking-label text-accent-strong">
              {formatYearRange(edu.start_year, edu.end_year)}
            </p>
            <p className="mt-2 font-display text-lg font-bold">{edu.degree}</p>
            <p className="text-sm text-muted">{edu.institution}</p>
          </BentoCard>
        ) : null}

        {profile?.location ? (
          <BentoCard
            className="md:col-span-4"
            label="Location"
            icon={<MapPin className="h-5 w-5" />}
            delay={0.16}
          >
            <div className="mt-auto flex items-center gap-3">
              <span className="relative flex h-3 w-3" aria-hidden>
                <span className="absolute inset-0 animate-ping-slow rounded-full bg-accent" />
                <span className="relative h-3 w-3 rounded-full bg-accent" />
              </span>
              <p className="font-display text-xl font-bold">{profile.location}</p>
            </div>
          </BentoCard>
        ) : null}

        {current ? (
          <BentoCard
            className="md:col-span-4"
            label="Current role"
            icon={<Briefcase className="h-5 w-5" />}
            delay={0.2}
          >
            <p className="font-display text-lg font-bold">{current.designation}</p>
            <p className="text-sm text-accent">{current.company}</p>
          </BentoCard>
        ) : null}

        {categories.length > 0 ? (
          <BentoCard
            className={current || profile?.location ? "md:col-span-4" : "md:col-span-8"}
            label="Technical interests"
            icon={<Sparkles className="h-5 w-5" />}
            delay={0.24}
          >
            <ul className="flex flex-wrap gap-2">
              {categories.map((c) => (
                <li key={c} className="chip transition hover:border-accent/50 hover:text-foreground">
                  {c}
                </li>
              ))}
            </ul>
          </BentoCard>
        ) : null}
      </div>

      <ProfileEditor profile={profile} />
    </Section>
  );
}