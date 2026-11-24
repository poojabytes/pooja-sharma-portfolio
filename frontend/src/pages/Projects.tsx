import Seo from "@/components/common/Seo";
import LoadingState from "@/components/common/LoadingState";
import Section from "@/components/common/Section";
import SectionHeading from "@/components/common/SectionHeading";
import ProjectsShowcase from "@/components/projects/ProjectsShowcase";
import { usePortfolio } from "@/context/PortfolioContext";

export default function Projects() {
  const { data, loading } = usePortfolio();

  if (loading) return <LoadingState />;

  return (
    <Section tone="violet" side="right" className="!pt-12">
      <Seo title="Projects | Pooja Sharma" />
      <SectionHeading
        eyebrow="Projects"
        title="All work."
        highlight={["work"]}
        description="Filter by technology to explore the projects."
      />
      {data.projects.length === 0 ? (
        <p className="bento-card text-sm text-muted">No projects published yet.</p>
      ) : (
        <ProjectsShowcase projects={data.projects} filterable />
      )}
    </Section>
  );
}