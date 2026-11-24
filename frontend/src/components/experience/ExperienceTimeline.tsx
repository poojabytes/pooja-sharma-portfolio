import { motion, useScroll, useSpring } from "framer-motion";
import { useRef } from "react";
import TiltCard from "@/components/effects/TiltCard";
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
      <p className="bento-card text-sm text-muted">
        Experience entries will appear here once added.
      </p>
    );
  }

  return (
    <div ref={ref} className="relative">
      {/* Track + scroll-driven progress line */}
      <div
        aria-hidden
        className="absolute bottom-0 left-4 top-0 w-px -translate-x-1/2 bg-border md:left-1/2"
      >
        <motion.div
          style={{ scaleY: progress }}
          className="h-full w-full origin-top bg-accent"
        />
      </div>

      <ol className="space-y-12">
        {items.map((item, index) => {
          const fromLeft = index % 2 === 0;
          const period = [
            formatMonthYear(item.start_date),
            item.is_current ? "Present" : formatMonthYear(item.end_date),
          ]
            .filter(Boolean)
            .join(" – ");
          const points = bullets(item.responsibilities);
          const tech = splitTechnologies(item.technologies);

          return (
            <li key={item.id} className="relative grid md:grid-cols-2 md:gap-16">
              {/* Node */}
              <div
                aria-hidden
                className="absolute left-4 top-8 z-10 -translate-x-1/2 md:left-1/2"
              >
                <motion.span
                  className="relative block h-4 w-4 rounded-full border-2 border-accent bg-background"
                  initial={{ scale: 0.4 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true, margin: "-120px" }}
                  transition={{ type: "spring", stiffness: 300, damping: 14 }}
                >
                  {item.is_current ? (
                    <span className="absolute inset-0 animate-ping-slow rounded-full bg-accent" />
                  ) : null}
                  <span className="absolute inset-[3px] rounded-full bg-accent" />
                </motion.span>
              </div>

              <motion.div
                className={`pl-11 md:pl-0 ${fromLeft ? "md:col-start-1" : "md:col-start-2"}`}
                initial={{ opacity: 0, x: fromLeft ? -48 : 48 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              >
                <TiltCard reveal={false} max={3} className="bento-card g-border">
                  <div className="relative z-10">
                    <div className="flex flex-wrap items-center gap-2">
                      {period ? (
                        <span className="rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
                          {period}
                        </span>
                      ) : null}
                      {item.employment_type ? (
                        <span className="chip">{item.employment_type}</span>
                      ) : null}
                      {item.is_current ? (
                        <span className="chip border-emerald-400/40 text-emerald-400">Current</span>
                      ) : null}
                    </div>

                    <h3 className="mt-4 font-display text-xl font-bold md:text-2xl">
                      {item.designation}
                    </h3>
                    <p className="font-medium text-accent">{item.company}</p>

                    {points.length > 1 ? (
                      <ul className="mt-4 space-y-2 text-sm text-muted">
                        {points.map((p, i) => (
                          <li key={i} className="flex gap-3">
                            <span
                              aria-hidden
                              className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent"
                            />
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
                  </div>
                </TiltCard>
              </motion.div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}