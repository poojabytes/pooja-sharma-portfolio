import { Link } from "react-router-dom";
import SectionHeading from "@/components/common/SectionHeading";
import ProjectCard from "@/components/projects/ProjectCard";
import type { Project } from "@/types/portfolio";

type Props = {
  projects: Project[];
  allCount: number;
};

export default function FeaturedProjectsSection({ projects, allCount }: Props) {
  const featured = projects.length > 0 ? projects : [];

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 md:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionHeading
          id="projects"
          eyebrow="Work"
          title="Featured projects"
          description="Highlighted builds with links to repositories and live demos."
        />
        {allCount > 0 ? (
          <Link to="/projects" className="text-sm text-accent hover:underline">
            View all ({allCount})
          </Link>
        ) : null}
      </div>
      {featured.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((project) => (
            <ProjectCard key={project.id} project={project} compact />
          ))}
        </div>
      ) : (
        <p className="bento-card text-sm text-muted">
          No featured projects yet. Mark projects as featured in the admin dashboard.
        </p>
      )}
    </section>
  );
}