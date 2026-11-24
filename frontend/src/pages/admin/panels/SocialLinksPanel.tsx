import { useCallback, useEffect, useState } from "react";
import { AdminField, AdminInput, AdminPanel } from "@/components/admin/AdminField";
import CrudListEditor from "@/components/admin/CrudListEditor";
import LoadingState from "@/components/common/LoadingState";
import {
  adminCreateSocialLink,
  adminDeleteSocialLink,
  adminListSocialLinks,
} from "@/services/admin.service";
import { useRefreshPortfolio } from "@/hooks/useRefreshPortfolio";
import { getApiErrorMessage } from "@/utils/apiError";
import type { SocialLink } from "@/types/portfolio";

export default function SocialLinksPanel() {
  const refresh = useRefreshPortfolio();
  const [items, setItems] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [platform, setPlatform] = useState("github");
  const [label, setLabel] = useState("GitHub");
  const [url, setUrl] = useState("");
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setItems(await adminListSocialLinks());
  }, []);

  useEffect(() => {
    void load().finally(() => setLoading(false));
  }, [load]);

  const add = async () => {
    setError(null);
    try {
      await adminCreateSocialLink({
        platform,
        label,
        url,
        display_order: items.length,
      });
      setUrl("");
      await load();
      refresh();
    } catch (err) {
      setError(getApiErrorMessage(err, "Could not add link"));
    }
  };

  if (loading) return <LoadingState />;

  return (
    <AdminPanel title="Social links" description="Footer and sharing links.">
      {error ? <p className="mb-4 text-sm text-red-400">{error}</p> : null}
      <CrudListEditor
        items={items}
        getKey={(i) => i.id}
        renderTitle={(i) => i.label}
        renderSubtitle={(i) => i.url}
        onDelete={async (id) => {
          await adminDeleteSocialLink(id);
          await load();
          refresh();
        }}
        form={
          <div className="grid gap-4 sm:grid-cols-2">
            <AdminField label="Platform">
              <AdminInput value={platform} onChange={(e) => setPlatform(e.target.value)} />
            </AdminField>
            <AdminField label="Label">
              <AdminInput value={label} onChange={(e) => setLabel(e.target.value)} />
            </AdminField>
            <AdminField label="URL" hint="Full https URL">
              <AdminInput value={url} onChange={(e) => setUrl(e.target.value)} />
            </AdminField>
            <AddLinkButton add={add} />
          </div>
        }
      />
    </AdminPanel>
  );
}

function AddLinkButton({ add }: { add: () => Promise<void> }) {
  return (
    <div className="flex items-end">
      <button
        type="button"
        onClick={() => void add()}
        className="w-full rounded-xl bg-accent py-2.5 text-sm font-medium text-white"
      >
        Add link
      </button>
    </div>
  );
}