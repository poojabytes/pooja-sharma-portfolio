import { useCallback, useEffect, useState } from "react";
import { AdminField, AdminInput, AdminPanel, AdminTextarea } from "@/components/admin/AdminField";
import LoadingState from "@/components/common/LoadingState";
import {
  adminCreateProject,
  adminDeleteProject,
  adminListProjects,
  adminUploadProjectThumbnail,
} from "@/services/admin.service";
import { useRefreshPortfolio } from "@/hooks/useRefreshPortfolio";
import { getApiErrorMessage } from "@/utils/apiError";
import type { Project } from "@/types/portfolio";

type ProjectForm = {
  title: string;
  description: string;
  technologies: string;
  github_url: string;
  live_url: string;
  is_featured: boolean;
};

const EMPTY_FORM: ProjectForm = {
  title: "",
  description: "",
  technologies: "",
  github_url: "",
  live_url: "",
  is_featured: false,
};

export default function ProjectsPanel() {
  const refresh = useRefreshPortfolio();
  const [items, setItems] = useState<Project[]>([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setItems(await adminListProjects());
  }, []);

  useEffect(() => {
    void load().finally(() => setLoading(false));
  }, [load]);

  const create = async () => {
    setError(null);
    try {
      await adminCreateProject({
        title: form.title,
        description: form.description || null,
        technologies: form.technologies || null,
        github_url: form.github_url || null,
        live_url: form.live_url || null,
        is_featured: form.is_featured,
        display_order: items.length,
        thumbnail_url: null,
      });
      setForm(EMPTY_FORM);
      await load();
      refresh();
    } catch (err) {
      setError(getApiErrorMessage(err, "Create failed"));
    }
  };

  if (loading) return <LoadingState />;

  return (
    <AdminPanel title="Projects" description="Featured projects appear on the home page.">
      {error ? <p className="mb-4 text-sm text-red-400">{error}</p> : null}
      <div className="bento-card grid gap-4">
        <AdminField label="Title">
          <AdminInput
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
        </AdminField>
        <AdminField label="Description">
          <AdminTextarea
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </AdminField>
        <AdminField label="Technologies (comma-separated)">
          <AdminInput
            value={form.technologies}
            onChange={(e) => setForm({ ...form, technologies: e.target.value })}
          />
        </AdminField>
        <div className="grid gap-4 sm:grid-cols-2">
          <AdminField label="GitHub URL">
            <AdminInput
              value={form.github_url}
              onChange={(e) => setForm({ ...form, github_url: e.target.value })}
            />
          </AdminField>
          <AdminField label="Live URL">
            <AdminInput
              value={form.live_url}
              onChange={(e) => setForm({ ...form, live_url: e.target.value })}
            />
          </AdminField>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.is_featured}
            onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
          />
          Featured on home
        </label>
        <button
          type="button"
          onClick={() => void create()}
          className="rounded-xl bg-accent py-2.5 text-sm font-medium text-white"
        >
          Add project
        </button>
      </div>
      <ul className="mt-8 space-y-3">
        {items.map((p) => (
          <ProjectRow
            key={p.id}
            project={p}
            onThumbnail={async (file) => {
              try {
                await adminUploadProjectThumbnail(p.id, file);
                await load();
                refresh();
              } catch (err) {
                setError(getApiErrorMessage(err, "Thumbnail upload failed"));
              }
            }}
            onDelete={async () => {
              await adminDeleteProject(p.id);
              await load();
              refresh();
            }}
          />
        ))}
      </ul>
    </AdminPanel>
  );
}

function ProjectRow({
  project,
  onThumbnail,
  onDelete,
}: {
  project: Project;
  onThumbnail: (file: File) => Promise<void>;
  onDelete: () => Promise<void>;
}) {
  return (
    <li className="bento-card">
      <h3 className="font-semibold">{project.title}</h3>
      <p className="mt-1 line-clamp-2 text-xs text-muted">{project.description}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <label className="cursor-pointer rounded-lg border border-border px-3 py-1.5 text-xs">
          Upload thumbnail
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void onThumbnail(file);
            }}
          />
        </label>
        <button
          type="button"
          onClick={() => void onDelete()}
          className="rounded-lg border border-border px-3 py-1.5 text-xs text-red-300"
        >
          Delete
        </button>
      </div>
    </li>
  );
}