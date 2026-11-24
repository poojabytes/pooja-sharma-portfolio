import { useCallback, useEffect, useState } from "react";
import { AdminPanel } from "@/components/admin/AdminField";
import LoadingState from "@/components/common/LoadingState";
import {
  adminDeleteResume,
  adminGetResume,
  adminUploadResume,
} from "@/services/admin.service";
import { useRefreshPortfolio } from "@/hooks/useRefreshPortfolio";
import { formatDateTime } from "@/utils/format";
import { getApiErrorMessage } from "@/utils/apiError";
import type { Resume } from "@/types/portfolio";

export default function ResumePanel() {
  const refresh = useRefreshPortfolio();
  const [resume, setResume] = useState<Resume | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setResume(await adminGetResume());
  }, []);

  useEffect(() => {
    void load().finally(() => setLoading(false));
  }, [load]);

  if (loading) return <LoadingState />;

  return (
    <AdminPanel title="Resume" description="PDF only. Replaces the previous file on upload.">
      {error ? <p className="mb-4 text-sm text-red-400">{error}</p> : null}
      {resume ? (
        <div className="bento-card text-sm">
          <p className="font-medium">{resume.file_name}</p>
          <p className="mt-1 text-muted">Updated {formatDateTime(resume.updated_at)}</p>
          <a
            href={resume.file_url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-block text-accent hover:underline"
          >
            Preview PDF
          </a>
        </div>
      ) : (
        <p className="bento-card text-sm text-muted">No resume uploaded.</p>
      )}
      <div className="bento-card mt-6 space-y-4">
        <label className="block text-sm">
          Upload PDF resume
          <input
            type="file"
            accept="application/pdf"
            className="mt-2 block w-full text-sm"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              setError(null);
              try {
                setResume(await adminUploadResume(file));
                refresh();
              } catch (err) {
                setError(getApiErrorMessage(err, "Upload failed"));
              }
            }}
          />
        </label>
        {resume ? (
          <button
            type="button"
            onClick={async () => {
              try {
                await adminDeleteResume();
                setResume(null);
                refresh();
              } catch (err) {
                setError(getApiErrorMessage(err, "Delete failed"));
              }
            }}
            className="rounded-lg border border-border px-4 py-2 text-sm text-red-300"
          >
            Delete resume
          </button>
        ) : null}
      </div>
    </AdminPanel>
  );
}