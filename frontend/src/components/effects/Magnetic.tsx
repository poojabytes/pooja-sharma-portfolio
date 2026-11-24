import { motion, useMotionValue, useSpring } from "framer-motion";
import { useRef, type PointerEvent, type ReactNode } from "react";
import { useInteractiveMotion } from "@/hooks/useInteractiveMotion";

type Props = {
  children: ReactNode;
  strength?: number;
  className?: string;
};

/** Pulls its child toward the pointer. No-op on touch / reduced motion. */
export default function Magnetic({ children, strength = 0.35, className = "" }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const enabled = useInteractiveMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 16, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 16, mass: 0.4 });

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!enabled || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={reset}
      style={{ x: sx, y: sy }}
      className={`inline-block ${className}`}
    >
      {children}
    </motion.div>
  );
}