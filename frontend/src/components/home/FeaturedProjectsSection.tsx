import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import Section from "@/components/common/Section";
import SectionHeading from "@/components/common/SectionHeading";
import ProjectsEditor from "@/components/owner/editors/ProjectsEditor";
import ProjectsShowcase from "@/components/projects/ProjectsShowcase";
import type { Project } from "@/types/portfolio";

type Props = {
  projects: Project[];
  allProjects?: Project[];
  allCount: number;
};

export default function FeaturedProjectsSection({
  projects,
  allProjects,
  allCount,
}: Props) {
  return (
    <Section id="projects" tone="violet" side="right">
      <SectionHeading
        eyebrow="Projects"
        index="03"
        title="Selected work."
        highlight={["work"]}
        description="Highlighted builds with links to repositories and live demos."
      />
      {projects.length > 0 ? (
        <ProjectsShowcase projects={projects} />
      ) : (
        <p className="bento-card text-sm text-muted">
          No featured projects yet. Add a project and mark it as featured.
        </p>
      )}
      {allCount > 0 ? (
        <div className="mt-12 flex justify-center">
          <Link to="/projects" className="btn-ghost group">
            View all projects ({allCount})
            <ArrowUpRight
              className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              aria-hidden
            />
          </Link>
        </div>
      ) : null}

      <ProjectsEditor projects={allProjects ?? projects} />
    </Section>
  );
}