import Seo from "@/components/common/Seo";
import LoadingState from "@/components/common/LoadingState";
import SectionHeading from "@/components/common/SectionHeading";
import ExperienceTimeline from "@/components/experience/ExperienceTimeline";
import { usePortfolio } from "@/context/PortfolioContext";

export default function Experience() {
  const { data, loading } = usePortfolio();

  if (loading) return <LoadingState />;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:px-6">
      <Seo title="Experience | Pooja Sharma" />
      <SectionHeading title="Professional experience" />
      <ExperienceTimeline items={data.experience} />
    </div>
  );
}