import { splitTechnologies, formatMonthYear } from "@/utils/format";
import type { Experience } from "@/types/portfolio";

type Props = {
  items: Experience[];
};

export default function ExperienceTimeline({ items }: Props) {
  if (items.length === 0) {
    return (
      <p className="bento-card text-sm text-muted">
        Experience entries will appear here once added in the admin dashboard.
      </p>
    );
  }

  return (
    <ol className="space-y-4">
      {items.map((item) => {
        const period = [
          formatMonthYear(item.start_date),
          item.is_current ? "Present" : formatMonthYear(item.end_date),
        ]
          .filter(Boolean)
          .join(" – ");

        return (
          <li key={item.id} className="bento-card">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <div>
                <h3 className="font-semibold">{item.designation}</h3>
                <p className="text-sm text-accent">{item.company}</p>
              </div>
              <p className="text-xs text-muted">{period}</p>
            </div>
            {item.employment_type ? (
              <p className="mt-1 text-xs text-muted">{item.employment_type}</p>
            ) : null}
            {item.responsibilities ? (
              <p className="mt-3 whitespace-pre-wrap text-sm text-muted">
                {item.responsibilities}
              </p>
            ) : null}
            {item.technologies ? (
              <ul className="mt-3 flex flex-wrap gap-2">
                {splitTechnologies(item.technologies).map((t) => (
                  <li
                    key={t}
                    className="rounded-md border border-border px-2 py-0.5 text-xs text-muted"
                  >
                    {t}
                  </li>
                ))}
              </ul>
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}