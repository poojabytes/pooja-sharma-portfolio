import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, CheckCircle2, Info, type LucideIcon } from "lucide-react";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

type ToastKind = "success" | "error" | "info";

type Toast = {
  id: number;
  kind: ToastKind;
  message: string;
};

type ToastContextValue = {
  push: (kind: ToastKind, message: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

const DURATION = 4000;

const STYLES: Record<ToastKind, { icon: LucideIcon; color: string }> = {
  success: { icon: CheckCircle2, color: "rgb(52 211 153)" },
  error: { icon: AlertCircle, color: "rgb(248 113 113)" },
  info: { icon: Info, color: "rgb(var(--c-accent))" },
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const counter = useRef(0);

  const push = useCallback((kind: ToastKind, message: string) => {
    const id = ++counter.current;
    setToasts((prev) => [...prev, { id, kind, message }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, DURATION);
  }, []);

  const value = useMemo(() => ({ push }), [push]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className="pointer-events-none fixed bottom-4 right-4 z-[300] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-2"
        aria-live="polite"
      >
        <AnimatePresence initial={false}>
          {toasts.map((t) => {
            const { icon: Icon, color } = STYLES[t.kind];
            return (
              <motion.div
                key={t.id}
                layout
                initial={{ opacity: 0, x: 60, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 60, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
                className="glass-panel pointer-events-auto relative overflow-hidden rounded-2xl shadow-2xl"
              >
                <div className="flex items-start gap-3 px-4 py-3.5 text-sm">
                  <Icon className="mt-0.5 h-4 w-4 shrink-0" style={{ color }} aria-hidden />
                  <p className="text-foreground">{t.message}</p>
                </div>
                <motion.span
                  aria-hidden
                  className="absolute inset-x-0 bottom-0 h-0.5 origin-left"
                  style={{ background: color }}
                  initial={{ scaleX: 1 }}
                  animate={{ scaleX: 0 }}
                  transition={{ duration: DURATION / 1000, ease: "linear" }}
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}