import { useState } from "react";
import { OwnerEditPanel } from "@/components/owner/OwnerOnly";
import { OwnerField, OwnerInput } from "@/components/owner/OwnerField";
import { assertImageFile, assertPdfResume } from "@/constants/uploads";
import { useToast } from "@/context/ToastContext";
import { useRefreshPortfolio } from "@/hooks/useRefreshPortfolio";
import {
  ownerCreateCertificate,
  ownerDeleteCertificate,
  ownerUploadCertificateImage,
  ownerUploadCertificatePdf,
} from "@/services/owner.service";
import { getApiErrorMessage } from "@/utils/apiError";
import type { Certificate } from "@/types/portfolio";

type Props = { certificates: Certificate[] };

export default function CertificatesEditor({ certificates }: Props) {
  const refresh = useRefreshPortfolio();
  const toast = useToast();
  const [title, setTitle] = useState("");
  const [issuer, setIssuer] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const add = async () => {
    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await ownerCreateCertificate({
        title: title.trim(),
        issuer: issuer || null,
        display_order: certificates.length,
      });
      setTitle("");
      setIssuer("");
      refresh();
      toast.push("success", "Certificate added");
    } catch (err) {
      setError(getApiErrorMessage(err, "Create failed"));
    } finally {
      setBusy(false);
    }
  };

  return (
    <OwnerEditPanel title="certificates">
      <div className="grid gap-4 sm:grid-cols-2">
        <OwnerField label="Title">
          <OwnerInput value={title} onChange={(e) => setTitle(e.target.value)} />
        </OwnerField>
        <OwnerField label="Issuer">
          <OwnerInput value={issuer} onChange={(e) => setIssuer(e.target.value)} />
        </OwnerField>
      </div>
      <button type="button" onClick={() => void add()} disabled={busy} className="btn-primary">
        Add certificate
      </button>
      {error ? <p className="text-sm text-red-500">{error}</p> : null}
      <ul className="space-y-3">
        {certificates.map((c) => (
          <li key={c.id} className="rounded-xl border border-border bg-background p-3">
            <p className="font-medium">{c.title}</p>
            {c.issuer ? <p className="text-xs text-muted">{c.issuer}</p> : null}
            <div className="mt-3 flex flex-wrap gap-2">
              <label className="cursor-pointer rounded-lg border border-border px-3 py-1.5 text-xs">
                Image
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    try {
                      assertImageFile(file);
                      await ownerUploadCertificateImage(c.id, file);
                      refresh();
                      toast.push("success", "Image uploaded");
                    } catch (err) {
                      setError(
                        err instanceof Error
                          ? err.message
                          : getApiErrorMessage(err, "Upload failed"),
                      );
                    }
                    e.target.value = "";
                  }}
                />
              </label>
              <label className="cursor-pointer rounded-lg border border-border px-3 py-1.5 text-xs">
                PDF
                <input
                  type="file"
                  accept="application/pdf,.pdf"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    try {
                      assertPdfResume(file);
                      await ownerUploadCertificatePdf(c.id, file);
                      refresh();
                      toast.push("success", "PDF uploaded");
                    } catch (err) {
                      setError(
                        err instanceof Error
                          ? err.message
                          : getApiErrorMessage(err, "Upload failed"),
                      );
                    }
                    e.target.value = "";
                  }}
                />
              </label>
              <button
                type="button"
                className="rounded-lg border border-border px-3 py-1.5 text-xs text-red-500"
                onClick={async () => {
                  try {
                    await ownerDeleteCertificate(c.id);
                    refresh();
                    toast.push("success", "Certificate deleted");
                  } catch (err) {
                    setError(getApiErrorMessage(err, "Delete failed"));
                  }
                }}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </OwnerEditPanel>
  );
}
