import { useCallback, useEffect, useState } from "react";
import { AdminField, AdminInput, AdminPanel } from "@/components/admin/AdminField";
import LoadingState from "@/components/common/LoadingState";
import {
  adminCreateCertificate,
  adminDeleteCertificate,
  adminListCertificates,
  adminUploadCertificateImage,
  adminUploadCertificatePdf,
} from "@/services/admin.service";
import { useRefreshPortfolio } from "@/hooks/useRefreshPortfolio";
import { getApiErrorMessage } from "@/utils/apiError";
import type { Certificate } from "@/types/portfolio";

export default function CertificatesPanel() {
  const refresh = useRefreshPortfolio();
  const [items, setItems] = useState<Certificate[]>([]);
  const [title, setTitle] = useState("");
  const [issuer, setIssuer] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setItems(await adminListCertificates());
  }, []);

  useEffect(() => {
    void load().finally(() => setLoading(false));
  }, [load]);

  const add = async () => {
    setError(null);
    try {
      await adminCreateCertificate({
        title,
        issuer: issuer || null,
        display_order: items.length,
      });
      setTitle("");
      setIssuer("");
      await load();
      refresh();
    } catch (err) {
      setError(getApiErrorMessage(err, "Create failed"));
    }
  };

  if (loading) return <LoadingState />;

  return (
    <AdminPanel title="Certificates">
      {error ? <p className="mb-4 text-sm text-red-400">{error}</p> : null}
      <div className="bento-card grid gap-4 sm:grid-cols-2">
        <AdminField label="Title">
          <AdminInput value={title} onChange={(e) => setTitle(e.target.value)} />
        </AdminField>
        <AdminField label="Issuer">
          <AdminInput value={issuer} onChange={(e) => setIssuer(e.target.value)} />
        </AdminField>
        <div className="sm:col-span-2">
          <button
            type="button"
            onClick={() => void add()}
            className="rounded-xl bg-accent py-2.5 text-sm font-medium text-white"
          >
            Add certificate
          </button>
        </div>
      </div>
      <ul className="mt-6 space-y-3">
        {items.map((c) => (
          <CertificateRow
            key={c.id}
            cert={c}
            onImage={async (file) => {
              await adminUploadCertificateImage(c.id, file);
              await load();
              refresh();
            }}
            onPdf={async (file) => {
              await adminUploadCertificatePdf(c.id, file);
              await load();
              refresh();
            }}
            onDelete={async () => {
              await adminDeleteCertificate(c.id);
              await load();
              refresh();
            }}
          />
        ))}
      </ul>
    </AdminPanel>
  );
}

function CertificateRow({
  cert,
  onImage,
  onPdf,
  onDelete,
}: {
  cert: Certificate;
  onImage: (f: File) => Promise<void>;
  onPdf: (f: File) => Promise<void>;
  onDelete: () => Promise<void>;
}) {
  return (
    <li className="bento-card">
      <p className="font-medium">{cert.title}</p>
      <div className="mt-3 flex flex-wrap gap-2 text-xs">
        <label className="cursor-pointer rounded-lg border border-border px-3 py-1.5">
          Image
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void onImage(f);
            }}
          />
        </label>
        <label className="cursor-pointer rounded-lg border border-border px-3 py-1.5">
          PDF
          <input
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void onPdf(f);
            }}
          />
        </label>
        <button
          type="button"
          onClick={() => void onDelete()}
          className="rounded-lg border border-border px-3 py-1.5 text-red-300"
        >
          Delete
        </button>
        {cert.image_url ? <span className="self-center text-muted">Image set</span> : null}
      </div>
    </li>
  );
}