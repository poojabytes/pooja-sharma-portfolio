import { useEffect, useState } from "react";
import { AdminField, AdminInput, AdminPanel, AdminTextarea } from "@/components/admin/AdminField";
import LoadingState from "@/components/common/LoadingState";
import {
  adminGetProfile,
  adminUpdateProfile,
  adminUploadProfilePhoto,
} from "@/services/admin.service";
import { useRefreshPortfolio } from "@/hooks/useRefreshPortfolio";
import { useToast } from "@/context/ToastContext";
import { getApiErrorMessage } from "@/utils/apiError";
import type { Profile } from "@/types/portfolio";

export default function ProfilePanel() {
  const refreshPublic = useRefreshPortfolio();
  const toast = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      try {
        setProfile(await adminGetProfile());
      } catch (err) {
        setError(getApiErrorMessage(err, "Failed to load profile"));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const updateField = (key: keyof Profile, value: string) => {
    setProfile((p) => (p ? { ...p, [key]: value } : p));
  };

  const save = async () => {
    if (!profile) return;
    setSaving(true);
    setMessage(null);
    setError(null);
    try {
      const updated = await adminUpdateProfile({
        name: profile.name,
        designation: profile.designation ?? undefined,
        biography: profile.biography ?? undefined,
        email: profile.email ?? undefined,
        location: profile.location ?? undefined,
      });
      setProfile(updated);
      refreshPublic();
      setMessage("Profile saved.");
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
      const updated = await adminUploadProfilePhoto(file);
      setProfile(updated);
      refreshPublic();
      setMessage("Profile photo updated.");
    } catch (err) {
      setError(getApiErrorMessage(err, "Upload failed"));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingState />;
  if (!profile) return <p className="text-sm text-red-400">{error ?? "No profile"}</p>;

  return (
    <AdminPanel title="Profile" description="Public hero and about content.">
      <div className="bento-card space-y-4">
        {profile.profile_image_url ? (
          <img
            src={profile.profile_image_url}
            alt=""
            className="h-24 w-24 rounded-xl object-cover ring-1 ring-border"
          />
        ) : null}
        <AdminField label="Profile photo">
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={(e) => void onPhoto(e.target.files?.[0] ?? null)}
            className="text-sm"
          />
        </AdminField>
        <AdminField label="Name">
          <AdminInput value={profile.name} onChange={(e) => updateField("name", e.target.value)} />
        </AdminField>
        <AdminField label="Designation">
          <AdminInput
            value={profile.designation ?? ""}
            onChange={(e) => updateField("designation", e.target.value)}
          />
        </AdminField>
        <AdminField label="Email">
          <AdminInput
            type="email"
            value={profile.email ?? ""}
            onChange={(e) => updateField("email", e.target.value)}
          />
        </AdminField>
        <AdminField label="Location">
          <AdminInput
            value={profile.location ?? ""}
            onChange={(e) => updateField("location", e.target.value)}
          />
        </AdminField>
        <AdminField label="Biography">
          <AdminTextarea
            rows={6}
            value={profile.biography ?? ""}
            onChange={(e) => updateField("biography", e.target.value)}
          />
        </AdminField>
      </div>
      {message ? <p className="mt-4 text-sm text-accent">{message}</p> : null}
      {error ? <p className="mt-4 text-sm text-red-400">{error}</p> : null}
      <button
        type="button"
        onClick={() => void save()}
        disabled={saving}
        className="mt-6 rounded-xl bg-accent px-5 py-2.5 text-sm font-medium text-white disabled:opacity-60"
      >
        {saving ? "Saving..." : "Save profile"}
      </button>
    </AdminPanel>
  );
}