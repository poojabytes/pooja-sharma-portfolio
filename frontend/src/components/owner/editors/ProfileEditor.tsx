import { useEffect, useState } from "react";
import { OwnerEditPanel } from "@/components/owner/OwnerOnly";
import { OwnerField, OwnerInput, OwnerTextarea } from "@/components/owner/OwnerField";
import { assertImageFile } from "@/constants/uploads";
import { useToast } from "@/context/ToastContext";
import { useRefreshPortfolio } from "@/hooks/useRefreshPortfolio";
import { ownerUpdateProfile, ownerUploadProfilePhoto } from "@/services/owner.service";
import { getApiErrorMessage } from "@/utils/apiError";
import type { Profile } from "@/types/portfolio";

type Props = { profile: Profile | null };

export default function ProfileEditor({ profile }: Props) {
  const refresh = useRefreshPortfolio();
  const toast = useToast();
  const [draft, setDraft] = useState({
    name: profile?.name ?? "",
    designation: profile?.designation ?? "",
    email: profile?.email ?? "",
    location: profile?.location ?? "",
    biography: profile?.biography ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setDraft({
      name: profile?.name ?? "",
      designation: profile?.designation ?? "",
      email: profile?.email ?? "",
      location: profile?.location ?? "",
      biography: profile?.biography ?? "",
    });
  }, [
    profile?.id,
    profile?.name,
    profile?.designation,
    profile?.email,
    profile?.location,
    profile?.biography,
  ]);

  const save = async () => {
    setSaving(true);
    setError(null);
    try {
      await ownerUpdateProfile({
        name: draft.name,
        designation: draft.designation || undefined,
        email: draft.email || undefined,
        location: draft.location || undefined,
        biography: draft.biography || undefined,
      });
      refresh();
      toast.push("success", "Profile saved");
    } catch (err) {
      setError(getApiErrorMessage(err, "Save failed"));
    } finally {
      setSaving(false);
    }
  };

  const onPhoto = async (file: File | null) => {
    if (!file) return;
    setSaving(true);
    setError(null);
    try {
      assertImageFile(file);
      await ownerUploadProfilePhoto(file);
      refresh();
      toast.push("success", "Photo updated");
    } catch (err) {
      setError(err instanceof Error ? err.message : getApiErrorMessage(err, "Upload failed"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <OwnerEditPanel title="profile & about">
      {profile?.profile_image_url ? (
        <img
          src={profile.profile_image_url}
          alt=""
          className="h-20 w-20 rounded-xl object-cover ring-1 ring-border"
        />
      ) : null}
      <OwnerField label="Profile photo">
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="text-sm"
          onChange={(e) => void onPhoto(e.target.files?.[0] ?? null)}
        />
      </OwnerField>
      <div className="grid gap-4 sm:grid-cols-2">
        <OwnerField label="Name">
          <OwnerInput
            value={draft.name}
            onChange={(e) => setDraft({ ...draft, name: e.target.value })}
          />
        </OwnerField>
        <OwnerField label="Designation" hint="Separate roles with |">
          <OwnerInput
            value={draft.designation}
            onChange={(e) => setDraft({ ...draft, designation: e.target.value })}
          />
        </OwnerField>
        <OwnerField label="Email">
          <OwnerInput
            type="email"
            value={draft.email}
            onChange={(e) => setDraft({ ...draft, email: e.target.value })}
          />
        </OwnerField>
        <OwnerField label="Location">
          <OwnerInput
            value={draft.location}
            onChange={(e) => setDraft({ ...draft, location: e.target.value })}
          />
        </OwnerField>
      </div>
      <OwnerField label="About / biography">
        <OwnerTextarea
          rows={6}
          value={draft.biography}
          onChange={(e) => setDraft({ ...draft, biography: e.target.value })}
        />
      </OwnerField>
      {error ? <p className="text-sm text-red-500">{error}</p> : null}
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => void save()} disabled={saving} className="btn-primary">
          {saving ? "Saving..." : "Save"}
        </button>
      </div>
    </OwnerEditPanel>
  );
}
