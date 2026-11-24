import type { ReactNode } from "react";

type Tone = "violet" | "cyan" | "mix";

type Props = {
  id?: string;
  /** Kept for API compatibility. "mix" and "cyan" render a soft secondary-background band. */
  tone?: Tone;
  side?: "left" | "right";
  className?: string;
  children: ReactNode;
};

/**
 * Section wrapper with consistent vertical rhythm. Alternate sections get a flat
 * secondary-background band so the page reads in calm, soft layers (no glows).
 */
export default function Section({ id, tone = "violet", className = "", children }: Props) {
  const banded = tone !== "violet";
  return (
    <section
      id={id}
      className={`section-anchor relative py-14 sm:py-20 md:py-28 ${banded ? "bg-secondary/70" : ""} ${className}`}
    >
      <div className="relative mx-auto max-w-6xl px-4 sm:px-5 md:px-6">{children}</div>
    </section>
  );
}