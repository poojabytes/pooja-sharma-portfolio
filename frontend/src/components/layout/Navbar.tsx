import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import HashLink from "@/components/common/HashLink";
import Magnetic from "@/components/effects/Magnetic";
import { SITE } from "@/constants/site";
import { usePortfolio } from "@/context/PortfolioContext";
import { useScrollSpy } from "@/hooks/useScrollSpy";
import { mediaUrl } from "@/utils/mediaUrl";

const items = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
] as const;

const ids = items.map((i) => i.id);

const ROUTE_TO_ID: Record<string, string> = {
  "/about": "about",
  "/experience": "experience",
  "/contact": "contact",
};

export default function Navbar() {
  const { data, loading } = usePortfolio();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 32));

  const spied = useScrollSpy(ids, pathname === "/" && !loading);
  const activeId = pathname === "/" ? spied : (ROUTE_TO_ID[pathname] ?? null);
  const resume = data.resume;

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className="sticky top-0 z-50 px-3 pt-3 md:px-6">
      <nav
        aria-label="Main"
        className={[
          "glass-panel mx-auto flex items-center justify-between rounded-full px-3",
          "transition-[max-width,padding] duration-500 ease-out",
          scrolled ? "max-w-7xl py-1.5" : "max-w-7xl py-2.5",
        ].join(" ")}
      >
        <Link to="/" className="flex items-center gap-2.5 pl-1 font-display text-sm font-bold" aria-label={`${SITE.name} home`}>
          <motion.span
            whileHover={{ rotate: 8, scale: 1.08 }}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-xs font-extrabold text-on-accent"
            aria-hidden
          >
            PS
          </motion.span>
          <span className="hidden sm:inline">{SITE.name}</span>
        </Link>

        <ul className="hidden items-center gap-0.5 md:flex">
          {items.map((item) => {
            const active = activeId === item.id;
            return (
              <li key={item.id}>
                <HashLink
                  id={item.id}
                  className={`group relative block rounded-full px-4 py-2 text-sm transition-colors ${
                    active ? "text-foreground" : "text-muted hover:text-foreground"
                  }`}
                  aria-current={active ? "location" : undefined}
                >
                  {active ? (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-full bg-accent/10"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  ) : null}
                  <span className="relative">
                    {item.label}
                    <span
                      aria-hidden
                      className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-accent transition-transform duration-300 group-hover:scale-x-100"
                    />
                  </span>
                </HashLink>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2">
          {resume ? (
            <div className="hidden md:block">
              <Magnetic strength={0.4}>
                <a
                  href={mediaUrl(resume.file_url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary group !px-5 !py-2.5 text-xs sm:!px-6"
                >
                  Resume
                  <ArrowUpRight
                    className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    aria-hidden
                  />
                </a>
              </Magnetic>
            </div>
          ) : null}

          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={open ? "x" : "m"}
                initial={{ rotate: -80, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 80, opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="flex"
              >
                {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </motion.span>
            </AnimatePresence>
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open ? (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="glass-panel mx-auto mt-2 max-w-7xl rounded-2xl p-2 md:hidden"
          >
            <ul className="flex flex-col">
              {items.map((item, i) => (
                <motion.li
                  key={item.id}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i + 0.08 }}
                >
                  <HashLink
                    id={item.id}
                    onClick={() => setOpen(false)}
                    className={`flex items-center justify-between rounded-xl px-4 py-3.5 font-display text-lg font-semibold ${
                      activeId === item.id ? "bg-accent/15 text-foreground" : "text-muted"
                    }`}
                  >
                    {item.label}
                    <ArrowUpRight className="h-4 w-4 text-accent" aria-hidden />
                  </HashLink>
                </motion.li>
              ))}
              {resume ? (
                <motion.li
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * items.length + 0.08 }}
                  className="p-2"
                >
                  <a
                    href={mediaUrl(resume.file_url)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary w-full"
                  >
                    Resume <ArrowUpRight className="h-4 w-4" aria-hidden />
                  </a>
                </motion.li>
              ) : null}
            </ul>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}