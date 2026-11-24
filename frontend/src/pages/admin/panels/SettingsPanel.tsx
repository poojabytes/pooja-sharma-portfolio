import { useCallback, useEffect, useState } from "react";
import { AdminField, AdminInput, AdminPanel } from "@/components/admin/AdminField";
import LoadingState from "@/components/common/LoadingState";
import { adminListSettings, adminUpsertSetting } from "@/services/admin.service";
import { useToast } from "@/context/ToastContext";
import { useRefreshPortfolio } from "@/hooks/useRefreshPortfolio";
import { getApiErrorMessage } from "@/utils/apiError";

export default function SettingsPanel() {
  const [defaultTheme, setDefaultTheme] = useState("dark");
  const [siteTitle, setSiteTitle] = useState("Pooja Sharma | Developer Portfolio");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();
  const refreshPublic = useRefreshPortfolio();

  const load = useCallback(async () => {
    const settings = await adminListSettings();
    const theme = settings.find((s) => s.key === "default_theme");
    const title = settings.find((s) => s.key === "site_title");
    if (theme) setDefaultTheme(theme.value);
    if (title) setSiteTitle(title.value);
  }, []);

  useEffect(() => {
    void load().finally(() => setLoading(false));
  }, [load]);

  const save = async () => {
    setMessage(null);
    setError(null);
    try {
      await adminUpsertSetting("default_theme", defaultTheme);
      await adminUpsertSetting("site_title", siteTitle);
      setMessage("Settings saved.");
      toast.push("success", "Settings saved");
      refreshPublic();
    } catch (err) {
      setError(getApiErrorMessage(err, "Save failed"));
    }
  };

  if (loading) return <LoadingState />;

  return (
    <AdminPanel title="Settings" description="Website metadata stored in PostgreSQL.">
      <div className="bento-card space-y-4">
        <AdminField label="Default theme (public hint)" hint="dark or light">
          <AdminInput value={defaultTheme} onChange={(e) => setDefaultTheme(e.target.value)} />
        </AdminField>
        <AdminField label="Site title (SEO)">
          <AdminInput value={siteTitle} onChange={(e) => setSiteTitle(e.target.value)} />
        </AdminField>
        <button
          type="button"
          onClick={() => void save()}
          className="rounded-xl bg-accent px-5 py-2.5 text-sm font-medium text-white"
        >
          Save settings
        </button>
      </div>
      {message ? <p className="mt-4 text-sm text-accent">{message}</p> : null}
      {error ? <p className="mt-4 text-sm text-red-400">{error}</p> : null}
    </AdminPanel>
  );
}