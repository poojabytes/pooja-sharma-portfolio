import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { useLocation, useOutlet } from "react-router-dom";
import { usePortfolio } from "@/context/PortfolioContext";
import SiteSettingsSync from "@/components/common/SiteSettingsSync";
import AmbientBackground from "@/components/effects/AmbientBackground";
import CustomCursor from "@/components/effects/CustomCursor";
import ScrollProgress from "@/components/effects/ScrollProgress";
import OwnerToolbar from "@/components/owner/OwnerToolbar";
import Footer from "./Footer";
import Navbar from "./Navbar";

/** Hash targets scroll into view (after the exit animation on route change); other routes reset to top. */
function useScrollManager() {
  const { pathname, hash } = useLocation();
  const prev = useRef<string | null>(null);

  useEffect(() => {
    const routeChanged = prev.current !== null && prev.current !== pathname;
    prev.current = pathname;

    if (hash) {
      const id = decodeURIComponent(hash.slice(1));
      const t = window.setTimeout(
        () => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" }),
        routeChanged ? 480 : 60,
      );
      return () => window.clearTimeout(t);
    }
    if (routeChanged) {
      const t = window.setTimeout(
        () => window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior }),
        260,
      );
      return () => window.clearTimeout(t);
    }
  }, [pathname, hash]);
}

export default function MainLayout() {
  const { data } = usePortfolio();
  const { pathname } = useLocation();
  const outlet = useOutlet(data);
  useScrollManager();

  return (
    <div className="flex min-h-screen flex-col">
      <AmbientBackground />
      <ScrollProgress />
      <CustomCursor />
      <SiteSettingsSync />
      <Navbar />
      <main className="flex-1">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
          >
            {outlet}
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer socialLinks={data.socialLinks} email={data.profile?.email} />
      <OwnerToolbar />
    </div>
  );
}