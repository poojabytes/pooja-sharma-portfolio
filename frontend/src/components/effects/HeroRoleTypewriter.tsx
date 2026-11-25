import { useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

type Props = {
  text: string;
  /** Milliseconds between each character while typing or erasing. */
  charMs?: number;
  className?: string;
};

const HOLD_TYPED_MS = 2_400;
const HOLD_EMPTY_MS = 700;
const ERASE_FACTOR = 0.75;

/**
 * Premium role line: types full text, pauses, erases, repeats.
 * Reserved width via invisible full string — no layout shift.
 */
export default function HeroRoleTypewriter({ text, charMs = 100, className = "" }: Props) {
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(reduced ? text : "");

  useEffect(() => {
    if (reduced) {
      setDisplay(text);
      return;
    }

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const clear = () => {
      if (timer) clearTimeout(timer);
    };

    const typeForward = (index: number) => {
      if (cancelled) return;
      if (index > text.length) {
        timer = setTimeout(() => eraseBackward(text.length), HOLD_TYPED_MS);
        return;
      }
      setDisplay(text.slice(0, index));
      timer = setTimeout(() => typeForward(index + 1), charMs);
    };

    const eraseBackward = (index: number) => {
      if (cancelled) return;
      if (index < 0) {
        setDisplay("");
        timer = setTimeout(() => typeForward(1), HOLD_EMPTY_MS);
        return;
      }
      setDisplay(text.slice(0, index));
      timer = setTimeout(() => eraseBackward(index - 1), Math.round(charMs * ERASE_FACTOR));
    };

    setDisplay("");
    typeForward(1);

    return () => {
      cancelled = true;
      clear();
    };
  }, [charMs, reduced, text]);

  const showCursor = !reduced;

  return (
    <p
      className={`mx-auto w-full max-w-3xl px-2 font-display text-xl font-bold leading-snug tracking-tight text-foreground sm:text-2xl md:text-[1.75rem] lg:text-3xl ${className}`}
      aria-label={text}
    >
      <span className="inline-grid justify-items-center">
        <span className="invisible col-start-1 row-start-1 select-none" aria-hidden>
          {text}
          {showCursor ? "\u00A0" : null}
        </span>
        <span className="col-start-1 row-start-1 whitespace-nowrap">
          {display}
          {showCursor ? (
            <span
              aria-hidden
              className="hero-typewriter-cursor ml-px inline-block h-[0.82em] w-[2px] translate-y-[0.06em] bg-accent align-middle"
            />
          ) : null}
        </span>
      </span>
    </p>
  );
}