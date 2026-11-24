import Seo from "@/components/common/Seo";
import LoadingState from "@/components/common/LoadingState";
import SectionHeading from "@/components/common/SectionHeading";
import SkillsSection from "@/components/home/SkillsSection";
import EducationSection from "@/components/home/EducationSection";
import { usePortfolio } from "@/context/PortfolioContext";

export default function About() {
  const { data, loading } = usePortfolio();

  if (loading) return <LoadingState />;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:px-6">
      <Seo title="About | Pooja Sharma" />
      <SectionHeading
        title="About me"
        description={data.profile?.designation ?? undefined}
      />
      <article className="bento-card mb-12 whitespace-pre-wrap text-muted">
        {data.profile?.biography ?? "Biography not set yet."}
      </article>
      <SkillsSection skills={data.skills} />
      <EducationSection education={data.education} />
    </div>
  );
}