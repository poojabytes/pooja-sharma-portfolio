import { AnimatePresence, motion } from "framer-motion";
import {
  Cloud,
  Code2,
  Database,
  Monitor,
  Server,
  Sparkles,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { useMemo, useState } from "react";
import Section from "@/components/common/Section";
import SectionHeading from "@/components/common/SectionHeading";
import SkillsEditor from "@/components/owner/editors/SkillsEditor";
import type { Skill } from "@/types/portfolio";

const CATEGORY_ORDER = [
  "Programming Languages",
  "Backend Development",
  "Frontend Development",
  "Databases",
  "Cloud & DevOps",
  "Developer Tools",
  "AI / ML",
];

const ICON_RULES: [RegExp, LucideIcon][] = [
  [/python|program|language/i, Code2],
  [/backend|server|api/i, Server],
  [/front|web|ui/i, Monitor],
  [/data|sql/i, Database],
  [/cloud|devops|deploy/i, Cloud],
  [/tool/i, Wrench],
];

function iconFor(category: string): LucideIcon {
  return ICON_RULES.find(([re]) => re.test(category))?.[1] ?? Sparkles;
}

function orderIndex(category: string): number {
  const i = CATEGORY_ORDER.findIndex((c) => c.toLowerCase() === category.toLowerCase());
  return i === -1 ? CATEGORY_ORDER.length : i;
}

type Props = {
  skills: Skill[];
};

export default function SkillsSection({ skills }: Props) {
  const [active, setActive] = useState("All");

  const categories = useMemo(
    () =>
      [...new Set(skills.map((s) => s.category))].sort(
        (a, b) => orderIndex(a) - orderIndex(b) || a.localeCompare(b),
      ),
    [skills],
  );

  const grouped = useMemo(() => {
    const source =
      active === "All" ? categories : categories.filter((c) => c === active);
    return source
      .map((category) => ({
        category,
        items: skills
          .filter((s) => s.category === category)
          .sort((a, b) => a.display_order - b.display_order || a.name.localeCompare(b.name)),
      }))
      .filter((g) => g.items.length > 0);
  }, [active, categories, skills]);

  const tabs = ["All", ...categories];

  return (
    <Section id="skills" tone="cyan" side="right">
      <SectionHeading
        eyebrow="Skills"
        index="02"
        title="My tech stack."
        highlight={["tech"]}
        description="Skills organised by category — pick a filter or browse the full stack."
      />

      {skills.length === 0 ? (
        <p className="bento-card text-sm text-muted">Skills appear once you add them.</p>
      ) : (
        <>
          <div role="tablist" aria-label="Skill categories" className="mb-8 flex flex-wrap gap-2">
            {tabs.map((tab) => {
              const selected = active === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => setActive(tab)}
                  className={`relative rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    selected ? "text-on-accent" : "text-muted hover:text-foreground"
                  }`}
                >
                  {selected ? (
                    <motion.span
                      layoutId="skill-tab"
                      className="absolute inset-0 rounded-full bg-accent"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  ) : (
                    <span className="absolute inset-0 rounded-full border border-border" />
                  )}
                  <span className="relative">{tab}</span>
                </button>
              );
            })}
          </div>

          <div className="space-y-6">
            <AnimatePresence mode="popLayout">
              {grouped.map((group, gi) => {
                const Icon = iconFor(group.category);
                return (
                  <motion.section
                    key={group.category}
                    layout
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.4, delay: Math.min(gi, 6) * 0.04 }}
                    className="bento-card !p-5 sm:!p-6"
                  >
                    <header className="mb-4 flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-border bg-accent/10 text-accent">
                        <Icon className="h-5 w-5" aria-hidden />
                      </span>
                      <div>
                        <h3 className="font-display text-lg font-bold leading-tight">
                          {group.category}
                        </h3>
                        <p className="text-xs text-muted">
                          {group.items.length} skill{group.items.length === 1 ? "" : "s"}
                        </p>
                      </div>
                    </header>

                    <ul className="flex flex-wrap gap-2.5">
                      {group.items.map((skill) => (
                        <li key={skill.id}>
                          <span className="inline-flex items-center rounded-full border border-border bg-secondary/80 px-3.5 py-1.5 text-sm font-medium text-foreground transition hover:border-accent/40 hover:bg-accent/10">
                            {skill.name}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </motion.section>
                );
              })}
            </AnimatePresence>
          </div>
        </>
      )}

      <SkillsEditor skills={skills} />
    </Section>
  );
}
