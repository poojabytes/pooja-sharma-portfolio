import { motion } from "framer-motion";

type Props = {
  eyebrow?: string;
  title: string;
  description?: string;
  id?: string;
};

export default function SectionHeading({ eyebrow, title, description, id }: Props) {
  return (
    <motion.header
      id={id}
      className="section-anchor mb-8 max-w-2xl"
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.4 }}
    >
      {eyebrow ? (
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-accent">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">{title}</h2>
      {description ? <p className="mt-3 text-muted">{description}</p> : null}
    </motion.header>
  );
}