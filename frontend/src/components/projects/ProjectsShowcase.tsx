import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import type { Project } from "@/types/portfolio";
import { splitTechnologies } from "@/utils/format";
import ProjectCard from "./ProjectCard";

/** 7+5, 4+4+4, 5+7 — repeats every seven cards for an asymmetric rhythm. */
const SPANS = [
  "md:col-span-7",
  "md:col-span-5",
  "md:col-span-4",
  "md:col-span-4",
  "md:col-span-4",
  "md:col-span-5",
  "md:col-span-7",
];

type Props = {
  projects: Project[];
  filterable?: boolean;
};

export default function ProjectsShowcase({ projects, filterable = false }: Props) {
  const [active, setActive] = useState("All");

  // Filter chips come from the real technologies stored on each project.
  const tags = useMemo(() => {
    const counts = new Map<string, { label: string; n: number }>();
    for (const p of projects) {
      for (const t of splitTechnologies(p.technologies)) {
        const key = t.toLowerCase();
        const cur = counts.get(key);
        counts.set(key, { label: cur?.label ?? t, n: (cur?.n ?? 0) + 1 });
      }
    }
    return [...counts.values()]
      .sort((a, b) => b.n - a.n || a.label.localeCompare(b.label))
      .slice(0, 8)
      .map((v) => v.label);
  }, [projects]);

  const visible = projects.filter(
    (p) =>
      active === "All" ||
      splitTechnologies(p.technologies).some((t) => t.toLowerCase() === active.toLowerCase()),
  );

  return (
    <div>
      {filterable && tags.length > 1 ? (
        <div role="group" aria-label="Filter projects by technology" className="mb-8 flex flex-wrap gap-2">
          {["All", ...tags].map((tag) => {
            const selected = active === tag;
            return (
              <button
                key={tag}
                type="button"
                aria-pressed={selected}
                onClick={() => setActive(tag)}
                className={`relative rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  selected ? "text-on-accent" : "text-muted hover:text-foreground"
                }`}
              >
                {selected ? (
                  <motion.span
                    layoutId="project-filter"
                    className="absolute inset-0 rounded-full bg-accent"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                ) : (
                  <span className="absolute inset-0 rounded-full border border-border" />
                )}
                <span className="relative">{tag}</span>
              </button>
            );
          })}
        </div>
      ) : null}

      <motion.div layout className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-12">
        <AnimatePresence mode="popLayout">
          {visible.map((project, i) => (
            <motion.div
              key={project.id}
              layout
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: (i % 3) * 0.06, ease: [0.22, 1, 0.36, 1] }}
              className={`col-span-1 flex ${SPANS[i % SPANS.length]}`}
            >
              <ProjectCard project={project} className="w-full" />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}