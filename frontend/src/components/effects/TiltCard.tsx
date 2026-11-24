import { motion, useMotionValue, useSpring } from "framer-motion";
import { useRef, type PointerEvent, type ReactNode } from "react";
import { useInteractiveMotion } from "@/hooks/useInteractiveMotion";

type Props = {
  children: ReactNode;
  className?: string;
  /** Max tilt in degrees. */
  max?: number;
  /** Scroll-reveal on mount. Disable when a parent already animates the card. */
  reveal?: boolean;
  delay?: number;
  /** Value for [data-cursor] so the custom cursor can react. */
  cursor?: string;
};

/**
 * 3D tilt + pointer-following spotlight. Entrance animation uses opacity/y only,
 * so it never fights with the rotate values.
 */
export default function TiltCard({
  children,
  className = "",
  max = 7,
  reveal = true,
  delay = 0,
  cursor,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const enabled = useInteractiveMotion();
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 180, damping: 18, mass: 0.5 });
  const sry = useSpring(ry, { stiffness: 180, damping: 18, mass: 0.5 });

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!enabled || !el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    ry.set((px - 0.5) * 2 * max);
    rx.set((0.5 - py) * 2 * max);
    el.style.setProperty("--sx", `${e.clientX - r.left}px`);
    el.style.setProperty("--sy", `${e.clientY - r.top}px`);
  };

  const reset = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <motion.div
      ref={ref}
      data-cursor={cursor}
      onPointerMove={onMove}
      onPointerLeave={reset}
      initial={reveal ? { opacity: 0, y: 28 } : false}
      whileInView={reveal ? { opacity: 1, y: 0 } : undefined}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      style={{ rotateX: srx, rotateY: sry, transformPerspective: 900 }}
      className={`group relative ${className}`}
    >
      {enabled ? (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background:
              "radial-gradient(360px circle at var(--sx, 50%) var(--sy, 50%), rgb(var(--c-accent) / 0.06), transparent 65%)",
          }}
        />
      ) : null}
      {children}
    </motion.div>
  );
}