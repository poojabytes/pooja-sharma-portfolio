import Seo from "@/components/common/Seo";
import LoadingState from "@/components/common/LoadingState";
import ExperienceSection from "@/components/home/ExperienceSection";
import { usePortfolio } from "@/context/PortfolioContext";

export default function Experience() {
  const { data, loading } = usePortfolio();

  if (loading) return <LoadingState />;

  return (
    <>
      <Seo title="Experience | Pooja Sharma" />
      <ExperienceSection experience={data.experience} />
    </>
  );
}