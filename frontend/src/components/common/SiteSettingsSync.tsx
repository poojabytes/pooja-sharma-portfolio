import { useEffect } from "react";
import { usePortfolio } from "@/context/PortfolioContext";
import { useTheme } from "@/context/ThemeContext";
import { SITE } from "@/constants/site";

const THEME_KEY = "portfolio-theme";

/** Applies admin `site_title` / `default_theme` when the visitor has no saved preference. */
export default function SiteSettingsSync() {
  const { data } = usePortfolio();
  const { setTheme } = useTheme();

  useEffect(() => {
    const title = data.publicSettings.site_title;
    if (title && typeof document !== "undefined") {
      document.title = title;
    }
  }, [data.publicSettings.site_title]);

  useEffect(() => {
    const defaultTheme = data.publicSettings.default_theme;
    if (defaultTheme !== "light" && defaultTheme !== "dark") return;
    if (typeof window === "undefined") return;
    if (!localStorage.getItem(THEME_KEY)) {
      setTheme(defaultTheme);
    }
    localStorage.setItem("portfolio-default-theme", defaultTheme);
  }, [data.publicSettings.default_theme, setTheme]);

  useEffect(() => {
    if (!data.publicSettings.site_title) return;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute(
        "content",
        `${SITE.name} — ${data.profile?.designation ?? SITE.headline}`,
      );
    }
  }, [data.profile?.designation, data.publicSettings.site_title]);

  return null;
}