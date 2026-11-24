import { useState } from "react";
import { OwnerEditPanel } from "@/components/owner/OwnerOnly";
import { assertPdfResume } from "@/constants/uploads";
import { useToast } from "@/context/ToastContext";
import { useRefreshPortfolio } from "@/hooks/useRefreshPortfolio";
import { ownerDeleteResume, ownerUploadResume } from "@/services/owner.service";
import { formatDateTime } from "@/utils/format";
import { getApiErrorMessage } from "@/utils/apiError";
import type { Resume } from "@/types/portfolio";

type Props = { resume: Resume | null };

export default function ResumeEditor({ resume }: Props) {
  const refresh = useRefreshPortfolio();
  const toast = useToast();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const upload = async (file: File | null) => {
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      assertPdfResume(file);
      await ownerUploadResume(file);
      refresh();
      toast.push("success", "Resume uploaded");
    } catch (err) {
      setError(err instanceof Error ? err.message : getApiErrorMessage(err, "Upload failed"));
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    setBusy(true);
    setError(null);
    try {
      await ownerDeleteResume();
      refresh();
      toast.push("success", "Resume removed");
    } catch (err) {
      setError(getApiErrorMessage(err, "Delete failed"));
    } finally {
      setBusy(false);
    }
  };

  return (
    <OwnerEditPanel title="resume">
      {resume ? (
        <div className="rounded-xl border border-border bg-background px-4 py-3 text-sm">
          <p className="font-medium">{resume.file_name}</p>
          <p className="mt-1 text-muted">Updated {formatDateTime(resume.updated_at)}</p>
        </div>
      ) : (
        <p className="text-sm text-muted">No resume uploaded yet.</p>
      )}
      <label className="block text-sm">
        <span className="mb-1.5 block text-xs font-medium text-muted">
          Upload or replace PDF (max 10 MB)
        </span>
        <input
          type="file"
          accept="application/pdf,.pdf"
          disabled={busy}
          className="block w-full text-sm"
          onChange={(e) => {
            void upload(e.target.files?.[0] ?? null);
            e.target.value = "";
          }}
        />
      </label>
      {resume ? (
        <button
          type="button"
          disabled={busy}
          onClick={() => void remove()}
          className="rounded-lg border border-border px-4 py-2 text-sm text-red-500"
        >
          Remove resume
        </button>
      ) : null}
      {error ? <p className="text-sm text-red-500">{error}</p> : null}
    </OwnerEditPanel>
  );
}
