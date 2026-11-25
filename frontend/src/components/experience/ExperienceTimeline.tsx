import { motion, useScroll, useSpring } from "framer-motion";
import { useRef } from "react";
import type { Experience } from "@/types/portfolio";
import { formatMonthYear, splitTechnologies } from "@/utils/format";

type Props = {
  items: Experience[];
};

function bullets(raw: string | null): string[] {
  if (!raw) return [];
  return raw
    .split(/\r?\n/)
    .map((l) => l.replace(/^[\s•\-*]+/, "").trim())
    .filter(Boolean);
}

export default function ExperienceTimeline({ items }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 55%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  if (items.length === 0) {
    return (
      <p className="bento-card is-static text-sm text-muted">
        Experience entries will appear here once added.
      </p>
    );
  }

  return (
    <div ref={ref} className="relative mx-auto w-full max-w-3xl">
      <div aria-hidden className="absolute bottom-0 left-3 top-0 w-px bg-border sm:left-4">
        <motion.div style={{ scaleY: progress }} className="h-full w-full origin-top bg-accent" />
      </div>

      <ol className="space-y-8">
        {items.map((item) => {
          const period = [
            formatMonthYear(item.start_date),
            item.is_current ? "Present" : formatMonthYear(item.end_date),
          ]
            .filter(Boolean)
            .join(" – ");
          const points = bullets(item.responsibilities);
          const tech = splitTechnologies(item.technologies);

          return (
            <li key={item.id} className="relative pl-10 sm:pl-12">
              <span
                aria-hidden
                className="absolute left-3 top-6 z-10 h-3 w-3 -translate-x-1/2 rounded-full border-2 border-accent bg-background sm:left-4"
              >
                {item.is_current ? (
                  <span className="absolute inset-0 animate-ping-slow rounded-full bg-accent/40" />
                ) : null}
              </span>

              <motion.article
                className="bento-card is-static"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="flex flex-wrap items-center gap-2">
                  {period ? (
                    <span className="rounded-full border border-accent/35 bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
                      {period}
                    </span>
                  ) : null}
                  {item.employment_type ? <span className="chip">{item.employment_type}</span> : null}
                  {item.is_current ? (
                    <span className="chip border-emerald-400/40 text-emerald-600">Current</span>
                  ) : null}
                </div>

                <h3 className="mt-3 font-display text-xl font-bold md:text-2xl">{item.designation}</h3>
                <p className="font-medium text-accent">{item.company}</p>

                {points.length > 1 ? (
                  <ul className="mt-4 space-y-2 text-sm text-muted">
                    {points.map((p, i) => (
                      <li key={i} className="flex gap-3">
                        <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" />
                        {p}
                      </li>
                    ))}
                  </ul>
                ) : points.length === 1 ? (
                  <p className="mt-4 text-sm leading-relaxed text-muted">{points[0]}</p>
                ) : null}

                {tech.length > 0 ? (
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {tech.map((t) => (
                      <li key={t} className="chip">
                        {t}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </motion.article>
            </li>
          );
        })}
      </ol>
    </div>
  );
}