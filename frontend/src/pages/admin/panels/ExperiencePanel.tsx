import { useCallback, useEffect, useState } from "react";
import { AdminField, AdminInput, AdminPanel, AdminTextarea } from "@/components/admin/AdminField";
import CrudListEditor from "@/components/admin/CrudListEditor";
import LoadingState from "@/components/common/LoadingState";
import {
  adminCreateExperience,
  adminDeleteExperience,
  adminListExperience,
} from "@/services/admin.service";
import { useRefreshPortfolio } from "@/hooks/useRefreshPortfolio";
import { getApiErrorMessage } from "@/utils/apiError";
import type { Experience } from "@/types/portfolio";

export default function ExperiencePanel() {
  const refresh = useRefreshPortfolio();
  const [items, setItems] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    company: "",
    designation: "",
    employment_type: "",
    start_date: "",
    end_date: "",
    is_current: false,
    responsibilities: "",
    technologies: "",
  });
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setItems(await adminListExperience());
  }, []);

  useEffect(() => {
    void load().finally(() => setLoading(false));
  }, [load]);

  const add = async () => {
    setError(null);
    try {
      await adminCreateExperience({
        company: form.company,
        designation: form.designation,
        employment_type: form.employment_type || null,
        start_date: form.start_date || null,
        end_date: form.is_current ? null : form.end_date || null,
        is_current: form.is_current,
        responsibilities: form.responsibilities || null,
        technologies: form.technologies || null,
        display_order: items.length,
      });
      await load();
      refresh();
    } catch (err) {
      setError(getApiErrorMessage(err, "Could not save experience"));
    }
  };

  if (loading) return <LoadingState />;

  return (
    <AdminPanel title="Experience" description="Add only verified employment history.">
      {error ? <p className="mb-4 text-sm text-red-400">{error}</p> : null}
      <CrudListEditor
        items={items}
        getKey={(i) => i.id}
        renderTitle={(i) => `${i.designation} @ ${i.company}`}
        onDelete={async (id) => {
          await adminDeleteExperience(id);
          await load();
          refresh();
        }}
        form={
          <div className="grid gap-4 sm:grid-cols-2">
            <AdminField label="Company">
              <AdminInput
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
              />
            </AdminField>
            <AdminField label="Designation">
              <AdminInput
                value={form.designation}
                onChange={(e) => setForm({ ...form, designation: e.target.value })}
              />
            </AdminField>
            <AdminField label="Employment type">
              <AdminInput
                value={form.employment_type}
                onChange={(e) => setForm({ ...form, employment_type: e.target.value })}
              />
            </AdminField>
            <AdminField label="Start date">
              <AdminInput
                type="date"
                value={form.start_date}
                onChange={(e) => setForm({ ...form, start_date: e.target.value })}
              />
            </AdminField>
            <AdminField label="End date">
              <AdminInput
                type="date"
                disabled={form.is_current}
                value={form.end_date}
                onChange={(e) => setForm({ ...form, end_date: e.target.value })}
              />
            </AdminField>
            <label className="flex items-center gap-2 text-sm sm:col-span-2">
              <input
                type="checkbox"
                checked={form.is_current}
                onChange={(e) => setForm({ ...form, is_current: e.target.checked })}
              />
              Current role
            </label>
            <div className="sm:col-span-2">
              <AdminField label="Responsibilities">
                <AdminTextarea
                  rows={4}
                  value={form.responsibilities}
                  onChange={(e) => setForm({ ...form, responsibilities: e.target.value })}
                />
              </AdminField>
            </div>
            <div className="sm:col-span-2">
              <AdminField label="Technologies">
                <AdminInput
                  value={form.technologies}
                  onChange={(e) => setForm({ ...form, technologies: e.target.value })}
                />
              </AdminField>
            </div>
            <div className="sm:col-span-2">
              <button
                type="button"
                onClick={() => void add()}
                className="rounded-xl bg-accent px-5 py-2.5 text-sm font-medium text-white"
              >
                Add experience
              </button>
            </div>
          </div>
        }
      />
    </AdminPanel>
  );
}