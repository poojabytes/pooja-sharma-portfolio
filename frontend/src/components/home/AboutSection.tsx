import SectionHeading from "@/components/common/SectionHeading";

type Props = {
  biography: string | null;
};

export default function AboutSection({ biography }: Props) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12 md:px-6">
      <SectionHeading
        id="about"
        eyebrow="About"
        title="Professional introduction"
        description="Background, education focus, and technical interests — managed from the admin dashboard."
      />
      <article className="bento-card max-w-none text-muted">
        {biography ? (
          <p className="whitespace-pre-wrap leading-relaxed text-foreground/90">{biography}</p>
        ) : (
          <p>
            Add your biography in the admin dashboard. This section updates automatically when
            you save your profile.
          </p>
        )}
      </article>
    </section>
  );
}