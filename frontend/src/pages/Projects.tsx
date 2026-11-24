import Seo from "@/components/common/Seo";
import LoadingState from "@/components/common/LoadingState";
import SectionHeading from "@/components/common/SectionHeading";
import ProjectCard from "@/components/projects/ProjectCard";
import { usePortfolio } from "@/context/PortfolioContext";

export default function Projects() {
  const { data, loading } = usePortfolio();

  if (loading) return <LoadingState />;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:px-6">
      <Seo title="Projects | Pooja Sharma" />
      <SectionHeading
        title="All projects"
        description="GitHub links, demos, and tech stack from the API."
      />
      {data.projects.length === 0 ? (
        <p className="bento-card text-sm text-muted">No projects published yet.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {data.projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}