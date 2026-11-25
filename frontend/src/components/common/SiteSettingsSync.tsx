import { useEffect } from "react";
import { usePortfolio } from "@/context/PortfolioContext";
import { SITE } from "@/constants/site";

/** Applies the public `site_title` setting to the document title and meta description. */
export default function SiteSettingsSync() {
  const { data } = usePortfolio();

  useEffect(() => {
    const title = data.publicSettings.site_title;
    if (title && typeof document !== "undefined") {
      document.title = title;
    }
  }, [data.publicSettings.site_title]);

  useEffect(() => {
    if (!data.publicSettings.site_title) return;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute(
        "content",
        `${SITE.name} — ${SITE.headline}`,
      );
    }
  }, [data.profile?.designation, data.publicSettings.site_title]);

  return null;
}