import { useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

/** True on devices with a hover-capable fine pointer (desktop mouse / trackpad). */
export function useFinePointer(): boolean {
  const [fine, setFine] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setFine(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return fine;
}

/**
 * Gate for pointer-driven effects (cursor, tilt, magnetic, parallax).
 * Off on touch devices and whenever the user prefers reduced motion.
 */
export function useInteractiveMotion(): boolean {
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  return fine && !reduced;
}