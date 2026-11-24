import { GraduationCap } from "lucide-react";
import Section from "@/components/common/Section";
import SectionHeading from "@/components/common/SectionHeading";
import TiltCard from "@/components/effects/TiltCard";
import EducationEditor from "@/components/owner/editors/EducationEditor";
import { formatYearRange } from "@/utils/format";
import type { Education } from "@/types/portfolio";

type Props = {
  education: Education[];
};

export default function EducationSection({ education }: Props) {
  return (
    <Section id="education" tone="violet" side="right">
      <SectionHeading eyebrow="Education" title="My journey." highlight={["journey"]} />
      {education.length === 0 ? (
        <p className="bento-card text-sm text-muted">Education entries load from the API.</p>
      ) : (
        <ul className="grid gap-4 md:grid-cols-2">
          {education.map((item, i) => (
            <li key={item.id}>
              <TiltCard delay={i * 0.08} max={5} className="bento-card g-border h-full">
                <div className="relative z-10">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold uppercase tracking-label text-accent-strong">
                      {formatYearRange(item.start_year, item.end_year)}
                    </p>
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent transition-transform duration-700 group-hover:rotate-[360deg]">
                      <GraduationCap className="h-5 w-5" />
                    </span>
                  </div>
                  <h3 className="mt-4 font-display text-xl font-bold">{item.degree}</h3>
                  <p className="mt-1 text-sm text-muted">{item.institution}</p>
                  {item.field_of_study ? (
                    <p className="mt-2 text-sm text-muted">{item.field_of_study}</p>
                  ) : null}
                  {item.description ? (
                    <p className="mt-3 text-sm text-muted">{item.description}</p>
                  ) : null}
                </div>
              </TiltCard>
            </li>
          ))}
        </ul>
      )}

      <EducationEditor education={education} />
    </Section>
  );
}