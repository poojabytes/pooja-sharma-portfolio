import { motion } from "framer-motion";
import SplitText from "@/components/effects/SplitText";

type Props = {
  eyebrow?: string;
  title: string;
  /** Words to render in the brand gradient. */
  highlight?: readonly string[];
  description?: string;
  id?: string;
  index?: string;
};

export default function SectionHeading({ eyebrow, title, highlight, description, id, index }: Props) {
  return (
    <header id={id} className="section-anchor mb-12 max-w-4xl md:mb-16">
      {eyebrow ? (
        <motion.p
          className="label mb-4 flex items-center gap-3"
          initial={{ opacity: 0, x: -12 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {index ? <span className="text-muted">{index}</span> : null}
          <motion.span
            aria-hidden
            className="h-px w-10 origin-left bg-accent"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
          />
          {eyebrow}
        </motion.p>
      ) : null}

      <SplitText
        as="h2"
        text={title}
        highlight={highlight}
        className="text-4xl font-extrabold uppercase leading-[0.95] tracking-tight sm:text-6xl md:text-7xl"
      />

      <motion.span
        aria-hidden
        className="mt-6 block h-1 w-20 origin-left rounded-full bg-accent"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
      />

      {description ? (
        <motion.p
          className="mt-6 max-w-2xl text-base leading-relaxed text-muted md:text-lg"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {description}
        </motion.p>
      ) : null}
    </header>
  );
}