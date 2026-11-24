import { useState } from "react";
import { Trash2 } from "lucide-react";
import { OwnerEditPanel } from "@/components/owner/OwnerOnly";
import { OwnerField, OwnerInput, OwnerTextarea } from "@/components/owner/OwnerField";
import { useToast } from "@/context/ToastContext";
import { useRefreshPortfolio } from "@/hooks/useRefreshPortfolio";
import {
  ownerCreateExperience,
  ownerDeleteExperience,
  ownerUpdateExperience,
} from "@/services/owner.service";
import { getApiErrorMessage } from "@/utils/apiError";
import type { Experience } from "@/types/portfolio";

type Form = {
  company: string;
  designation: string;
  employment_type: string;
  start_date: string;
  end_date: string;
  is_current: boolean;
  responsibilities: string;
  technologies: string;
};

const EMPTY: Form = {
  company: "",
  designation: "",
  employment_type: "",
  start_date: "",
  end_date: "",
  is_current: false,
  responsibilities: "",
  technologies: "",
};

type Props = { experience: Experience[] };

export default function ExperienceEditor({ experience }: Props) {
  const refresh = useRefreshPortfolio();
  const toast = useToast();
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const cancel = () => {
    setEditingId(null);
    setForm(EMPTY);
    setError(null);
  };

  const startEdit = (item: Experience) => {
    setEditingId(item.id);
    setForm({
      company: item.company,
      designation: item.designation,
      employment_type: item.employment_type ?? "",
      start_date: item.start_date ?? "",
      end_date: item.end_date ?? "",
      is_current: item.is_current,
      responsibilities: item.responsibilities ?? "",
      technologies: item.technologies ?? "",
    });
  };

  const body = () => ({
    company: form.company,
    designation: form.designation,
    employment_type: form.employment_type || null,
    start_date: form.start_date || null,
    end_date: form.is_current ? null : form.end_date || null,
    is_current: form.is_current,
    responsibilities: form.responsibilities || null,
    technologies: form.technologies || null,
    display_order: editingId
      ? experience.find((e) => e.id === editingId)?.display_order ?? experience.length
      : experience.length,
  });

  const save = async () => {
    if (!form.company.trim() || !form.designation.trim()) {
      setError("Company and designation are required");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      if (editingId) {
        await ownerUpdateExperience(editingId, body());
        toast.push("success", "Experience updated");
      } else {
        await ownerCreateExperience(body());
        toast.push("success", "Experience added");
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
    <OwnerEditPanel title="experience">
      <div className="grid gap-4 sm:grid-cols-2">
        <OwnerField label="Company">
          <OwnerInput
            value={form.company}
            onChange={(e) => setForm({ ...form, company: e.target.value })}
          />
        </OwnerField>
        <OwnerField label="Designation">
          <OwnerInput
            value={form.designation}
            onChange={(e) => setForm({ ...form, designation: e.target.value })}
          />
        </OwnerField>
        <OwnerField label="Employment type">
          <OwnerInput
            value={form.employment_type}
            onChange={(e) => setForm({ ...form, employment_type: e.target.value })}
          />
        </OwnerField>
        <OwnerField label="Start date">
          <OwnerInput
            type="date"
            value={form.start_date}
            onChange={(e) => setForm({ ...form, start_date: e.target.value })}
          />
        </OwnerField>
        <OwnerField label="End date">
          <OwnerInput
            type="date"
            disabled={form.is_current}
            value={form.end_date}
            onChange={(e) => setForm({ ...form, end_date: e.target.value })}
          />
        </OwnerField>
        <label className="flex items-center gap-2 text-sm sm:col-span-2">
          <input
            type="checkbox"
            checked={form.is_current}
            onChange={(e) => setForm({ ...form, is_current: e.target.checked })}
          />
          Current role
        </label>
        <div className="sm:col-span-2">
          <OwnerField label="Responsibilities">
            <OwnerTextarea
              rows={4}
              value={form.responsibilities}
              onChange={(e) => setForm({ ...form, responsibilities: e.target.value })}
            />
          </OwnerField>
        </div>
        <div className="sm:col-span-2">
          <OwnerField label="Technologies">
            <OwnerInput
              value={form.technologies}
              onChange={(e) => setForm({ ...form, technologies: e.target.value })}
            />
          </OwnerField>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => void save()} disabled={busy} className="btn-primary">
          {editingId ? "Update" : "Add experience"}
        </button>
        {editingId ? (
          <button type="button" onClick={cancel} className="btn-ghost">
            Cancel
          </button>
        ) : null}
      </div>
      {error ? <p className="text-sm text-red-500">{error}</p> : null}
      <ul className="space-y-2">
        {experience.map((item) => (
          <li
            key={item.id}
            className="flex items-center justify-between gap-3 rounded-xl border border-border bg-background px-3 py-2"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">
                {item.designation} @ {item.company}
              </p>
            </div>
            <div className="flex gap-1">
              <button
                type="button"
                className="rounded-lg border border-border px-2 py-1 text-xs"
                onClick={() => startEdit(item)}
              >
                Edit
              </button>
              <button
                type="button"
                className="rounded-lg border border-border p-2 text-muted hover:text-red-500"
                aria-label="Delete"
                onClick={async () => {
                  try {
                    await ownerDeleteExperience(item.id);
                    if (editingId === item.id) cancel();
                    refresh();
                    toast.push("success", "Experience deleted");
                  } catch (err) {
                    setError(getApiErrorMessage(err, "Delete failed"));
                  }
                }}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </OwnerEditPanel>
  );
}
