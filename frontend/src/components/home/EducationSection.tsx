import { GraduationCap } from "lucide-react";
import Section from "@/components/common/Section";
import SectionHeading from "@/components/common/SectionHeading";
import EducationEditor from "@/components/owner/editors/EducationEditor";
import { formatYearRange } from "@/utils/format";
import type { Education } from "@/types/portfolio";

type Props = {
  education: Education[];
};

export default function EducationSection({ education }: Props) {
  return (
    <Section id="education" tone="violet" side="right">
      <SectionHeading eyebrow="Education" title="My journey" highlight={["journey"]} />
      {education.length === 0 ? (
        <p className="bento-card is-static text-sm text-muted">Education entries load from the API.</p>
      ) : (
        <ul className="grid gap-4 md:grid-cols-2">
          {education.map((item) => (
            <li key={item.id}>
              <article className="bento-card is-static h-full">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs font-semibold uppercase tracking-label text-accent-strong">
                    {formatYearRange(item.start_year, item.end_year)}
                  </p>
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 text-accent">
                    <GraduationCap className="h-4 w-4" />
                  </span>
                </div>
                <h3 className="mt-3 font-display text-xl font-bold">{item.degree}</h3>
                <p className="mt-1 text-sm text-muted">{item.institution}</p>
                {item.field_of_study ? <p className="mt-2 text-sm text-muted">{item.field_of_study}</p> : null}
                {item.description ? <p className="mt-3 text-sm leading-relaxed text-muted">{item.description}</p> : null}
              </article>
            </li>
          ))}
        </ul>
      )}

      <EducationEditor education={education} />
    </Section>
  );
}