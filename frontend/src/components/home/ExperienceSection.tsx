import { Link } from "react-router-dom";
import SectionHeading from "@/components/common/SectionHeading";
import ExperienceTimeline from "@/components/experience/ExperienceTimeline";
import type { Experience } from "@/types/portfolio";

type Props = {
  experience: Experience[];
};

export default function ExperienceSection({ experience }: Props) {
  const preview = experience.slice(0, 2);

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 md:px-6">
      <SectionHeading
        id="experience"
        eyebrow="Career"
        title="Professional experience"
        description={
          experience.length === 0
            ? "Add roles in the admin panel — dates and achievements stay factual."
            : undefined
        }
      />
      <ExperienceTimeline items={preview} />
      {experience.length > 2 ? (
        <Link to="/experience" className="mt-4 inline-block text-sm text-accent hover:underline">
          Full experience →
        </Link>
      ) : null}
    </section>
  );
}