import Seo from "@/components/common/Seo";
import LoadingState from "@/components/common/LoadingState";
import AboutSection from "@/components/home/AboutSection";
import EducationSection from "@/components/home/EducationSection";
import SkillsSection from "@/components/home/SkillsSection";
import { usePortfolio } from "@/context/PortfolioContext";

export default function About() {
  const { data, loading } = usePortfolio();

  if (loading) return <LoadingState />;

  return (
    <>
      <Seo title="About | Pooja Sharma" />
      <AboutSection
        profile={data.profile}
        education={data.education}
        experience={data.experience}
        skills={data.skills}
      />
      <SkillsSection skills={data.skills} />
      <EducationSection education={data.education} />
    </>
  );
}