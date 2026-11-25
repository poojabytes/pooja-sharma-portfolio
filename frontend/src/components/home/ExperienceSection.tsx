import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import Section from "@/components/common/Section";
import SectionHeading from "@/components/common/SectionHeading";
import ExperienceTimeline from "@/components/experience/ExperienceTimeline";
import ExperienceEditor from "@/components/owner/editors/ExperienceEditor";
import type { Experience } from "@/types/portfolio";

type Props = {
  experience: Experience[];
  /** Limit entries (homepage preview). Omit to show all. */
  limit?: number;
};

export default function ExperienceSection({ experience, limit }: Props) {
  const shown = limit ? experience.slice(0, limit) : experience;

  return (
    <Section id="experience" tone="mix" side="left">
      <SectionHeading
        className="max-w-none"
        eyebrow="Experience"
        index="04"
        title="What I build."
        highlight={["build"]}
        description={
          experience.length === 0
            ? "Roles will appear here once you add experience."
            : "A timeline of the roles and responsibilities behind the work."
        }
      />
      <ExperienceTimeline items={shown} />
      {limit && experience.length > limit ? (
        <div className="mt-12 flex justify-center">
          <Link to="/experience" className="btn-ghost group">
            Full experience
            <ArrowUpRight
              className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              aria-hidden
            />
          </Link>
        </div>
      ) : null}

      <ExperienceEditor experience={experience} />
    </Section>
  );
}