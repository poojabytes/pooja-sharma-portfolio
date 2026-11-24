import SectionHeading from "@/components/common/SectionHeading";
import { formatYearRange } from "@/utils/format";
import type { Education } from "@/types/portfolio";

type Props = {
  education: Education[];
};

export default function EducationSection({ education }: Props) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12 md:px-6">
      <SectionHeading
        id="education"
        eyebrow="Education"
        title="Academic background"
      />
      {education.length === 0 ? (
        <p className="bento-card text-sm text-muted">Education entries load from the API.</p>
      ) : (
        <ul className="grid gap-4 md:grid-cols-2">
          {education.map((item) => (
            <li key={item.id} className="bento-card">
              <p className="text-xs font-medium uppercase tracking-wide text-accent">
                {formatYearRange(item.start_year, item.end_year)}
              </p>
              <h3 className="mt-2 text-lg font-semibold">{item.degree}</h3>
              <p className="mt-1 text-sm text-muted">{item.institution}</p>
              {item.field_of_study ? (
                <p className="mt-2 text-sm text-muted">{item.field_of_study}</p>
              ) : null}
              {item.description ? (
                <p className="mt-3 text-sm text-muted">{item.description}</p>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}