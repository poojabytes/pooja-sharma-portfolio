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
import TiltCard from "@/components/effects/TiltCard";
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

  const visible = skills.filter((s) => active === "All" || s.category === active);
  const tabs = ["All", ...categories];

  return (
    <Section id="skills" tone="cyan" side="right">
      <SectionHeading
        eyebrow="Skills"
        index="02"
        title="My tech stack."
        highlight={["tech"]}
        description="Languages, frameworks and tools I work with, grouped by area."
      />

      {skills.length === 0 ? (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORY_ORDER.map((c, i) => {
            const Icon = iconFor(c);
            return (
              <li key={c}>
                <TiltCard delay={i * 0.05} className="bento-card g-border flex items-center gap-4">
                  <span className="relative z-10 flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                    <Icon className="h-6 w-6" />
                  </span>
                  <div className="relative z-10">
                    <p className="font-display font-bold">{c}</p>
                    <p className="text-xs text-muted">Skills appear once you add them.</p>
                  </div>
                </TiltCard>
              </li>
            );
          })}
        </ul>
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

          <motion.ul layout className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            <AnimatePresence mode="popLayout">
              {visible.map((skill, i) => {
                const Icon = iconFor(skill.category);
                return (
                  <motion.li
                    key={skill.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9, y: 16 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.4, delay: Math.min(i, 12) * 0.03 }}
                  >
                    <TiltCard
                      reveal={false}
                      max={10}
                      className="bento-card g-border flex h-full flex-col items-start gap-4 !p-5"
                    >
                      <span
                        className="relative z-10 flex h-12 w-12 animate-float items-center justify-center rounded-2xl border border-border bg-accent/10 text-accent"
                        style={{ animationDelay: `${(i % 6) * 0.4}s` }}
                      >
                        <Icon className="h-6 w-6" />
                      </span>
                      <div className="relative z-10">
                        <p className="font-display text-base font-bold leading-tight">{skill.name}</p>
                        <p className="mt-1 text-[11px] uppercase tracking-label text-muted">
                          {skill.category}
                        </p>
                      </div>
                    </TiltCard>
                  </motion.li>
                );
              })}
            </AnimatePresence>
          </motion.ul>
        </>
      )}

      <SkillsEditor skills={skills} />
    </Section>
  );
}