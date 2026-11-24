import AboutSection from "@/components/home/AboutSection";
import CertificatesSection from "@/components/home/CertificatesSection";
import ContactSection from "@/components/home/ContactSection";
import EducationSection from "@/components/home/EducationSection";
import ExperienceSection from "@/components/home/ExperienceSection";
import FeaturedProjectsSection from "@/components/home/FeaturedProjectsSection";
import HeroSection from "@/components/home/HeroSection";
import ResumeSection from "@/components/home/ResumeSection";
import SkillsSection from "@/components/home/SkillsSection";
import Marquee from "@/components/effects/Marquee";
import Seo from "@/components/common/Seo";
import ErrorState from "@/components/common/ErrorState";
import LoadingState from "@/components/common/LoadingState";
import { usePortfolio } from "@/context/PortfolioContext";
import { SITE } from "@/constants/site";

export default function Home() {
  const { data, loading, error, reload } = usePortfolio();

  const featured =
    data.featuredProjects.length > 0
      ? data.featuredProjects
      : data.projects.filter((p) => p.is_featured);

  const marqueeItems =
    data.skills.length > 0
      ? data.skills.map((s) => s.name)
      : (data.profile?.designation ?? SITE.headline)
          .split("|")
          .map((s) => s.trim())
          .filter(Boolean);

  return (
    <>
      <Seo
        title={SITE.title}
        description={`${SITE.name} — ${SITE.headline}. Portfolio powered by FastAPI.`}
      />
      {loading ? <LoadingState label="Loading portfolio..." /> : null}
      {!loading && error ? (
        <div className="px-4 py-20">
          <ErrorState message={error} onRetry={() => void reload()} />
        </div>
      ) : null}
      {!loading && !error ? (
        <>
          <HeroSection
            profile={data.profile}
            skills={data.skills}
            socialLinks={data.socialLinks}
            resume={data.resume}
            education={data.education}
            projectCount={data.projects.length}
          />
          <Marquee items={marqueeItems} />
          <AboutSection
            profile={data.profile}
            education={data.education}
            experience={data.experience}
            skills={data.skills}
          />
          <SkillsSection skills={data.skills} />
          <FeaturedProjectsSection
            projects={featured}
            allProjects={data.projects}
            allCount={data.projects.length}
          />
          <ExperienceSection experience={data.experience} limit={3} />
          <EducationSection education={data.education} />
          <CertificatesSection certificates={data.certificates} />
          <ResumeSection resume={data.resume} />
          <ContactSection email={data.profile?.email} socialLinks={data.socialLinks} />
        </>
      ) : null}
    </>
  );
}