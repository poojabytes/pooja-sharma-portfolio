import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";
import { useInteractiveMotion } from "@/hooks/useInteractiveMotion";

type Mode = "default" | "link" | "project";

const SIZES: Record<Mode, number> = { default: 34, link: 56, project: 88 };

/**
 * Desktop-only cursor follower. The native cursor stays visible; this adds a
 * smooth ring + soft glow that reacts to links, buttons and project cards.
 */
export default function CustomCursor() {
  const enabled = useInteractiveMotion();
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const ringX = useSpring(x, { stiffness: 260, damping: 28, mass: 0.5 });
  const ringY = useSpring(y, { stiffness: 260, damping: 28, mass: 0.5 });
  const [mode, setMode] = useState<Mode>("default");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    const onMove = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
      const target = e.target instanceof Element ? e.target : null;
      const tagged = target?.closest("[data-cursor]")?.getAttribute("data-cursor");
      if (tagged === "project") setMode("project");
      else if (target?.closest("a, button, input, textarea, select, label, [data-cursor]"))
        setMode("link");
      else setMode("default");
    };
    const onLeave = () => setVisible(false);

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  const size = SIZES[mode];

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[200]">
      <motion.div style={{ x: ringX, y: ringY }} className="absolute left-0 top-0">
        <div className="-translate-x-1/2 -translate-y-1/2">
          <motion.div
            animate={{ width: size, height: size, opacity: visible ? 1 : 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
            className="flex items-center justify-center rounded-full border border-accent/70"
            style={{
              background:
                mode === "project" ? "rgb(var(--c-accent) / 0.2)" : "rgb(var(--c-accent) / 0.04)",
              backdropFilter: mode === "project" ? "blur(4px)" : undefined,
            }}
          >
            {mode === "project" ? (
              <span className="text-[10px] font-semibold uppercase tracking-label text-foreground">
                Explore
              </span>
            ) : null}
          </motion.div>
        </div>
      </motion.div>

      <motion.div style={{ x, y }} className="absolute left-0 top-0">
        <div
          className="h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent transition-opacity"
          style={{ opacity: visible && mode === "default" ? 1 : 0 }}
        />
      </motion.div>
    </div>
  );
}