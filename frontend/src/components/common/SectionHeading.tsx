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
    <header id={id} className="section-anchor mb-10 max-w-3xl md:mb-14">
      {eyebrow ? (
        <motion.p
          className="label mb-3"
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
        >
          {index ? <span className="mr-2 text-muted">{index}</span> : null}
          {eyebrow}
        </motion.p>
      ) : null}

      <SplitText
        as="h2"
        text={title}
        highlight={highlight}
        className="font-display text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl md:text-[2.65rem]"
      />

      {description ? (
        <motion.p
          className="mt-4 max-w-2xl text-base leading-relaxed text-muted md:mt-5 md:text-lg"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          {description}
        </motion.p>
      ) : null}
    </header>
  );
}