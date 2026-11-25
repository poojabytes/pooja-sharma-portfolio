import { Briefcase, Code2, GraduationCap, MapPin, Sparkles } from "lucide-react";
import type { ReactNode } from "react";
import Section from "@/components/common/Section";
import SectionHeading from "@/components/common/SectionHeading";
import { publicRole } from "@/constants/site";
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
  children,
}: {
  className?: string;
  label: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <article className={`bento-card is-static flex h-full min-h-[9.5rem] flex-col ${className ?? ""}`}>
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="label">{label}</p>
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-accent/10 text-accent">
          {icon}
        </span>
      </div>
      <div className="flex flex-1 flex-col">{children}</div>
    </article>
  );
}

export default function AboutSection({ profile, education, experience, skills }: Props) {
  const role = publicRole(profile?.designation);
  const edu = education[0];
  const current = experience.find((e) => e.is_current);
  const categories = [...new Set(skills.map((s) => s.category))];

  return (
    <Section id="about" tone="violet" side="left">
      <SectionHeading eyebrow="About" index="01" title="Who am I?" highlight={["am"]} />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <BentoCard label="Introduction" icon={<Sparkles className="h-4 w-4" />} className="md:col-span-2 xl:col-span-2">
          {profile?.biography ? (
            <p className="text-base leading-relaxed text-foreground/90 md:text-lg">
              {profile.biography}
            </p>
          ) : (
            <p className="text-muted">Your introduction will appear here once you add a biography.</p>
          )}
        </BentoCard>

        <BentoCard label="Professional identity" icon={<Code2 className="h-4 w-4" />}>
          <p className="font-display text-lg font-semibold text-foreground">{role}</p>
        </BentoCard>

        {edu ? (
          <BentoCard label="Education" icon={<GraduationCap className="h-4 w-4" />}>
            <p className="text-xs font-semibold uppercase tracking-label text-accent-strong">
              {formatYearRange(edu.start_year, edu.end_year)}
            </p>
            <p className="mt-2 font-display text-lg font-bold leading-snug">{edu.degree}</p>
            <p className="mt-1 text-sm text-muted">{edu.institution}</p>
          </BentoCard>
        ) : null}

        {current ? (
          <BentoCard label="Current role" icon={<Briefcase className="h-4 w-4" />}>
            <p className="font-display text-lg font-bold leading-snug">{current.designation}</p>
            <p className="mt-1 text-sm text-accent">{current.company}</p>
          </BentoCard>
        ) : null}

        {profile?.location ? (
          <BentoCard label="Location" icon={<MapPin className="h-4 w-4" />}>
            <p className="mt-auto font-display text-xl font-bold">{profile.location}</p>
          </BentoCard>
        ) : null}

        {categories.length > 0 ? (
          <BentoCard
            label="Technical interests"
            icon={<Sparkles className="h-4 w-4" />}
            className={!profile?.location && !current ? "md:col-span-2" : undefined}
          >
            <ul className="flex flex-wrap gap-2">
              {categories.map((c) => (
                <li key={c} className="chip">
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