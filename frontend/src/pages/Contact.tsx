import Seo from "@/components/common/Seo";
import ContactSection from "@/components/home/ContactSection";
import { usePortfolio } from "@/context/PortfolioContext";

export default function Contact() {
  const { data } = usePortfolio();

  return (
    <>
      <Seo title="Contact | Pooja Sharma" />
      <ContactSection email={data.profile?.email} socialLinks={data.socialLinks} />
    </>
  );
}