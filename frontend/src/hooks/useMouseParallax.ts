import { useMotionValue, useSpring } from "framer-motion";
import { useEffect } from "react";

/** Smoothed pointer position normalised to [-1, 1] on both axes. */
export function useMouseParallax(enabled: boolean) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 60, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 60, damping: 18, mass: 0.4 });

  useEffect(() => {
    if (!enabled) return;
    const onMove = (e: PointerEvent) => {
      x.set((e.clientX / window.innerWidth - 0.5) * 2);
      y.set((e.clientY / window.innerHeight - 0.5) * 2);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [enabled, x, y]);

  return { x: sx, y: sy };
}