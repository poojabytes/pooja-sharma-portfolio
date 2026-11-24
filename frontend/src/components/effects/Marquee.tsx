import { Sparkle } from "lucide-react";

type Props = {
  items: string[];
};

/** Decorative scrolling strip used as a section separator. Hidden from assistive tech. */
export default function Marquee({ items }: Props) {
  if (items.length === 0) return null;
  const base = items.length < 6 ? [...items, ...items, ...items] : items;
  const row = [...base, ...base];

  return (
    <div
      aria-hidden
      className="relative overflow-hidden border-y border-border py-5 md:py-7"
      style={{
        maskImage: "linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)",
        WebkitMaskImage: "linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)",
      }}
    >
      <div className="flex w-max animate-marquee items-center gap-8 whitespace-nowrap md:gap-12">
        {row.map((item, i) => (
          <span key={i} className="flex items-center gap-8 md:gap-12">
            <span
              className={`font-display text-4xl font-extrabold uppercase tracking-tight md:text-6xl ${
                i % 2 === 0 ? "text-outline" : "gradient-text"
              }`}
            >
              {item}
            </span>
            <Sparkle className="h-5 w-5 shrink-0 text-accent md:h-6 md:w-6" />
          </span>
        ))}
      </div>
    </div>
  );
}