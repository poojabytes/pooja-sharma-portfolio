import { useState } from "react";
import { Trash2 } from "lucide-react";
import { OwnerEditPanel } from "@/components/owner/OwnerOnly";
import { OwnerField, OwnerInput } from "@/components/owner/OwnerField";
import { useToast } from "@/context/ToastContext";
import { useRefreshPortfolio } from "@/hooks/useRefreshPortfolio";
import { ownerCreateSocialLink, ownerDeleteSocialLink } from "@/services/owner.service";
import { getApiErrorMessage } from "@/utils/apiError";
import type { SocialLink } from "@/types/portfolio";

type Props = { socialLinks: SocialLink[] };

export default function SocialLinksEditor({ socialLinks }: Props) {
  const refresh = useRefreshPortfolio();
  const toast = useToast();
  const [platform, setPlatform] = useState("github");
  const [label, setLabel] = useState("GitHub");
  const [url, setUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const add = async () => {
    if (!url.trim()) {
      setError("URL is required");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await ownerCreateSocialLink({
        platform,
        label,
        url: url.trim(),
        display_order: socialLinks.length,
      });
      setUrl("");
      refresh();
      toast.push("success", "Link added");
    } catch (err) {
      setError(getApiErrorMessage(err, "Could not add link"));
    } finally {
      setBusy(false);
    }
  };

  return (
    <OwnerEditPanel title="social links">
      <div className="grid gap-4 sm:grid-cols-2">
        <OwnerField label="Platform">
          <OwnerInput value={platform} onChange={(e) => setPlatform(e.target.value)} />
        </OwnerField>
        <OwnerField label="Label">
          <OwnerInput value={label} onChange={(e) => setLabel(e.target.value)} />
        </OwnerField>
        <div className="sm:col-span-2">
          <OwnerField label="URL" hint="Full https URL">
            <OwnerInput value={url} onChange={(e) => setUrl(e.target.value)} />
          </OwnerField>
        </div>
      </div>
      <button type="button" onClick={() => void add()} disabled={busy} className="btn-primary">
        Add link
      </button>
      {error ? <p className="text-sm text-red-500">{error}</p> : null}
      <ul className="space-y-2">
        {socialLinks.map((link) => (
          <li
            key={link.id}
            className="flex items-center justify-between gap-3 rounded-xl border border-border bg-background px-3 py-2"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{link.label}</p>
              <p className="truncate text-xs text-muted">{link.url}</p>
            </div>
            <button
              type="button"
              className="rounded-lg border border-border p-2 text-muted hover:text-red-500"
              aria-label={`Delete ${link.label}`}
              onClick={async () => {
                try {
                  await ownerDeleteSocialLink(link.id);
                  refresh();
                  toast.push("success", "Link removed");
                } catch (err) {
                  setError(getApiErrorMessage(err, "Delete failed"));
                }
              }}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </li>
        ))}
      </ul>
    </OwnerEditPanel>
  );
}
