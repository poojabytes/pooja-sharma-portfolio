import { useState } from "react";
import { Trash2 } from "lucide-react";
import { OwnerEditPanel } from "@/components/owner/OwnerOnly";
import { OwnerField, OwnerInput, OwnerTextarea } from "@/components/owner/OwnerField";
import { useToast } from "@/context/ToastContext";
import { useRefreshPortfolio } from "@/hooks/useRefreshPortfolio";
import {
  ownerCreateEducation,
  ownerDeleteEducation,
  ownerUpdateEducation,
} from "@/services/owner.service";
import { getApiErrorMessage } from "@/utils/apiError";
import type { Education } from "@/types/portfolio";

type Form = {
  institution: string;
  degree: string;
  field_of_study: string;
  start_year: string;
  end_year: string;
  description: string;
};

const EMPTY: Form = {
  institution: "",
  degree: "",
  field_of_study: "",
  start_year: "",
  end_year: "",
  description: "",
};

type Props = { education: Education[] };

export default function EducationEditor({ education }: Props) {
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

  const startEdit = (item: Education) => {
    setEditingId(item.id);
    setForm({
      institution: item.institution,
      degree: item.degree,
      field_of_study: item.field_of_study ?? "",
      start_year: item.start_year?.toString() ?? "",
      end_year: item.end_year?.toString() ?? "",
      description: item.description ?? "",
    });
  };

  const body = () => ({
    institution: form.institution,
    degree: form.degree,
    field_of_study: form.field_of_study || null,
    start_year: form.start_year ? Number(form.start_year) : null,
    end_year: form.end_year ? Number(form.end_year) : null,
    description: form.description || null,
    display_order: editingId
      ? education.find((e) => e.id === editingId)?.display_order ?? education.length
      : education.length,
  });

  const save = async () => {
    if (!form.institution.trim() || !form.degree.trim()) {
      setError("Institution and degree are required");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      if (editingId) {
        await ownerUpdateEducation(editingId, body());
        toast.push("success", "Education updated");
      } else {
        await ownerCreateEducation(body());
        toast.push("success", "Education added");
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
    <OwnerEditPanel title="education">
      <div className="grid gap-4 sm:grid-cols-2">
        <OwnerField label="Institution">
          <OwnerInput
            value={form.institution}
            onChange={(e) => setForm({ ...form, institution: e.target.value })}
          />
        </OwnerField>
        <OwnerField label="Degree">
          <OwnerInput
            value={form.degree}
            onChange={(e) => setForm({ ...form, degree: e.target.value })}
          />
        </OwnerField>
        <OwnerField label="Field of study">
          <OwnerInput
            value={form.field_of_study}
            onChange={(e) => setForm({ ...form, field_of_study: e.target.value })}
          />
        </OwnerField>
        <OwnerField label="Start year">
          <OwnerInput
            type="number"
            value={form.start_year}
            onChange={(e) => setForm({ ...form, start_year: e.target.value })}
          />
        </OwnerField>
        <OwnerField label="End year">
          <OwnerInput
            type="number"
            value={form.end_year}
            onChange={(e) => setForm({ ...form, end_year: e.target.value })}
          />
        </OwnerField>
        <div className="sm:col-span-2">
          <OwnerField label="Description">
            <OwnerTextarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </OwnerField>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => void save()} disabled={busy} className="btn-primary">
          {editingId ? "Update" : "Add education"}
        </button>
        {editingId ? (
          <button type="button" onClick={cancel} className="btn-ghost">
            Cancel
          </button>
        ) : null}
      </div>
      {error ? <p className="text-sm text-red-500">{error}</p> : null}
      <ul className="space-y-2">
        {education.map((item) => (
          <li
            key={item.id}
            className="flex items-center justify-between gap-3 rounded-xl border border-border bg-background px-3 py-2"
          >
            <p className="truncate text-sm font-medium">
              {item.degree} — {item.institution}
            </p>
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
                    await ownerDeleteEducation(item.id);
                    if (editingId === item.id) cancel();
                    refresh();
                    toast.push("success", "Education deleted");
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
