import { useState } from "react";
import { OwnerEditPanel } from "@/components/owner/OwnerOnly";
import { OwnerField, OwnerInput, OwnerTextarea } from "@/components/owner/OwnerField";
import { assertImageFile } from "@/constants/uploads";
import { useToast } from "@/context/ToastContext";
import { useRefreshPortfolio } from "@/hooks/useRefreshPortfolio";
import {
  ownerCreateProject,
  ownerDeleteProject,
  ownerUpdateProject,
  ownerUploadProjectThumbnail,
} from "@/services/owner.service";
import { getApiErrorMessage } from "@/utils/apiError";
import type { Project } from "@/types/portfolio";

type Form = {
  title: string;
  description: string;
  technologies: string;
  github_url: string;
  live_url: string;
  is_featured: boolean;
};

const EMPTY: Form = {
  title: "",
  description: "",
  technologies: "",
  github_url: "",
  live_url: "",
  is_featured: true,
};

type Props = { projects: Project[] };

export default function ProjectsEditor({ projects }: Props) {
  const refresh = useRefreshPortfolio();
  const toast = useToast();
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const startEdit = (p: Project) => {
    setEditingId(p.id);
    setForm({
      title: p.title,
      description: p.description ?? "",
      technologies: p.technologies ?? "",
      github_url: p.github_url ?? "",
      live_url: p.live_url ?? "",
      is_featured: p.is_featured,
    });
  };

  const cancel = () => {
    setEditingId(null);
    setForm(EMPTY);
    setError(null);
  };

  const payload = () => ({
    title: form.title,
    description: form.description || null,
    technologies: form.technologies || null,
    github_url: form.github_url || null,
    live_url: form.live_url || null,
    is_featured: form.is_featured,
    display_order: editingId
      ? projects.find((p) => p.id === editingId)?.display_order ?? projects.length
      : projects.length,
    thumbnail_url: editingId
      ? projects.find((p) => p.id === editingId)?.thumbnail_url ?? null
      : null,
  });

  const save = async () => {
    if (!form.title.trim()) {
      setError("Title is required");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      if (editingId) {
        await ownerUpdateProject(editingId, payload());
        toast.push("success", "Project updated");
      } else {
        await ownerCreateProject(payload());
        toast.push("success", "Project added");
      }
      cancel();
      refresh();
    } catch (err) {
      setError(getApiErrorMessage(err, "Save failed"));
    } finally {
      setBusy(false);
    }
  };

  return (
    <OwnerEditPanel title="projects">
      <div className="grid gap-4">
        <OwnerField label="Title">
          <OwnerInput
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
        </OwnerField>
        <OwnerField label="Description">
          <OwnerTextarea
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </OwnerField>
        <OwnerField label="Technologies (comma-separated)">
          <OwnerInput
            value={form.technologies}
            onChange={(e) => setForm({ ...form, technologies: e.target.value })}
          />
        </OwnerField>
        <div className="grid gap-4 sm:grid-cols-2">
          <OwnerField label="GitHub URL">
            <OwnerInput
              value={form.github_url}
              onChange={(e) => setForm({ ...form, github_url: e.target.value })}
            />
          </OwnerField>
          <OwnerField label="Live URL">
            <OwnerInput
              value={form.live_url}
              onChange={(e) => setForm({ ...form, live_url: e.target.value })}
            />
          </OwnerField>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.is_featured}
            onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
          />
          Featured on home
        </label>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => void save()} disabled={busy} className="btn-primary">
            {editingId ? "Update project" : "Add project"}
          </button>
          {editingId ? (
            <button type="button" onClick={cancel} className="btn-ghost">
              Cancel
            </button>
          ) : null}
        </div>
      </div>
      {error ? <p className="text-sm text-red-500">{error}</p> : null}
      <ul className="space-y-3">
        {projects.map((p) => (
          <li key={p.id} className="rounded-xl border border-border bg-background p-3">
            <p className="font-medium">{p.title}</p>
            <p className="mt-1 line-clamp-2 text-xs text-muted">{p.description}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                className="rounded-lg border border-border px-3 py-1.5 text-xs"
                onClick={() => startEdit(p)}
              >
                Edit
              </button>
              <label className="cursor-pointer rounded-lg border border-border px-3 py-1.5 text-xs">
                Thumbnail
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    try {
                      assertImageFile(file);
                      await ownerUploadProjectThumbnail(p.id, file);
                      refresh();
                      toast.push("success", "Thumbnail updated");
                    } catch (err) {
                      setError(
                        err instanceof Error
                          ? err.message
                          : getApiErrorMessage(err, "Thumbnail failed"),
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
                    await ownerDeleteProject(p.id);
                    if (editingId === p.id) cancel();
                    refresh();
                    toast.push("success", "Project deleted");
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
