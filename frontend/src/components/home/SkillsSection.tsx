import { motion } from "framer-motion";
import SectionHeading from "@/components/common/SectionHeading";
import type { Skill } from "@/types/portfolio";

const FALLBACK_CATEGORIES = [
  "Programming Languages",
  "Backend Development",
  "Frontend Development",
  "Databases",
  "Cloud & DevOps",
  "Developer Tools",
];

type Props = {
  skills: Skill[];
};

function groupSkills(skills: Skill[]): Map<string, Skill[]> {
  const map = new Map<string, Skill[]>();
  for (const skill of skills) {
    const list = map.get(skill.category) ?? [];
    list.push(skill);
    map.set(skill.category, list);
  }
  return map;
}

export default function SkillsSection({ skills }: Props) {
  const grouped = groupSkills(skills);
  const categories =
    skills.length > 0 ? [...grouped.keys()].sort() : FALLBACK_CATEGORIES;

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 md:px-6">
      <SectionHeading
        id="skills"
        eyebrow="Skills"
        title="Technical skills"
        description="Categorized expertise loaded from the API."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category, index) => {
          const items = grouped.get(category) ?? [];
          return (
            <motion.div
              key={category}
              className="bento-card"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
            >
              <h3 className="text-sm font-semibold text-foreground">{category}</h3>
              {items.length > 0 ? (
                <ul className="mt-4 flex flex-wrap gap-2">
                  {items.map((skill) => (
                    <li
                      key={skill.id}
                      className="rounded-lg border border-border bg-background px-2.5 py-1 text-xs text-muted"
                    >
                      {skill.name}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-xs text-muted">Skills will appear here once added.</p>
              )}
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}