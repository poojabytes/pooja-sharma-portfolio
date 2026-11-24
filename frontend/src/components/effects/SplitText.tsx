import { motion, type Variants } from "framer-motion";
import type { ElementType } from "react";

type Props = {
  text: string;
  as?: ElementType;
  className?: string;
  /** Words (punctuation ignored, case-insensitive) rendered with the brand gradient. */
  highlight?: readonly string[];
  mode?: "words" | "chars";
  delay?: number;
  stagger?: number;
  /** Animate when scrolled into view (default) or immediately on mount. */
  whenInView?: boolean;
};

const clean = (w: string) => w.replace(/[^\p{L}\p{N}']/gu, "").toLowerCase();

/**
 * Masked split-text reveal. Words (or characters) slide up out of a clip mask.
 * The full string is exposed to assistive tech via aria-label.
 */
export default function SplitText({
  text,
  as: Tag = "span",
  className = "",
  highlight = [],
  mode = "words",
  delay = 0,
  stagger,
  whenInView = true,
}: Props) {
  const step = stagger ?? (mode === "chars" ? 0.02 : 0.07);
  const hl = new Set(highlight.map(clean));

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: step, delayChildren: delay } },
  };
  const unit: Variants = {
    hidden: { y: "115%", opacity: 0 },
    show: { y: "0%", opacity: 1, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
  };

  const words = text.split(" ");

  return (
    <Tag className={className} aria-label={text}>
      <motion.span
        aria-hidden
        className="inline"
        variants={container}
        initial="hidden"
        animate={whenInView ? undefined : "show"}
        whileInView={whenInView ? "show" : undefined}
        viewport={{ once: true, margin: "-60px" }}
      >
        {words.map((word, wi) => {
          const gradient = hl.has(clean(word));
          return (
            <span key={`${word}-${wi}`}>
              <span className="inline-block overflow-hidden pb-[0.14em] align-bottom -mb-[0.14em]">
                {mode === "chars" ? (
                  <span className="inline-block">
                    {[...word].map((ch, ci) => (
                      <motion.span
                        key={ci}
                        variants={unit}
                        className={`inline-block ${gradient ? "gradient-text" : ""}`}
                      >
                        {ch}
                      </motion.span>
                    ))}
                  </span>
                ) : (
                  <motion.span
                    variants={unit}
                    className={`inline-block ${gradient ? "gradient-text" : ""}`}
                  >
                    {word}
                  </motion.span>
                )}
              </span>
              {wi < words.length - 1 ? " " : null}
            </span>
          );
        })}
      </motion.span>
    </Tag>
  );
}