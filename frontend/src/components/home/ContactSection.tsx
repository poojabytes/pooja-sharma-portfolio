import SectionHeading from "@/components/common/SectionHeading";
import ContactForm from "@/components/contact/ContactForm";

type Props = {
  email?: string | null;
};

export default function ContactSection({ email }: Props) {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-20 pt-12 md:px-6">
      <SectionHeading
        id="contact"
        eyebrow="Contact"
        title="Let's work together"
        description={
          email
            ? `Prefer email? Reach me at ${email}`
            : "Send a message — it posts directly to the portfolio backend."
        }
      />
      <ContactForm />
    </section>
  );
}