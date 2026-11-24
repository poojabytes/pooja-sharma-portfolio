import Seo from "@/components/common/Seo";
import SectionHeading from "@/components/common/SectionHeading";
import ContactForm from "@/components/contact/ContactForm";
import { usePortfolio } from "@/context/PortfolioContext";

export default function Contact() {
  const { data } = usePortfolio();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 md:px-6">
      <Seo title="Contact | Pooja Sharma" />
      <SectionHeading
        title="Contact"
        description={
          data.profile?.email
            ? `Email: ${data.profile.email}`
            : "Submit the form below to reach out."
        }
      />
      <ContactForm />
    </div>
  );
}