import { useCallback, useEffect, useState } from "react";
import { AdminField, AdminInput, AdminPanel, AdminTextarea } from "@/components/admin/AdminField";
import CrudListEditor from "@/components/admin/CrudListEditor";
import LoadingState from "@/components/common/LoadingState";
import {
  adminCreateEducation,
  adminDeleteEducation,
  adminListEducation,
} from "@/services/admin.service";
import { useRefreshPortfolio } from "@/hooks/useRefreshPortfolio";
import { getApiErrorMessage } from "@/utils/apiError";
import type { Education } from "@/types/portfolio";

type EduForm = {
  institution: string;
  degree: string;
  field_of_study: string;
  start_year: string;
  end_year: string;
  description: string;
};

const EMPTY: EduForm = {
  institution: "",
  degree: "",
  field_of_study: "",
  start_year: "",
  end_year: "",
  description: "",
};

export default function EducationPanel() {
  const refresh = useRefreshPortfolio();
  const [items, setItems] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setItems(await adminListEducation());
  }, []);

  useEffect(() => {
    void load().finally(() => setLoading(false));
  }, [load]);

  const add = async () => {
    setError(null);
    try {
      await adminCreateEducation({
        institution: form.institution,
        degree: form.degree,
        field_of_study: form.field_of_study || null,
        start_year: form.start_year ? Number(form.start_year) : null,
        end_year: form.end_year ? Number(form.end_year) : null,
        description: form.description || null,
        display_order: items.length,
      });
      setForm(EMPTY);
      await load();
      refresh();
    } catch (err) {
      setError(getApiErrorMessage(err, "Could not save education"));
    }
  };

  if (loading) return <LoadingState />;

  return (
    <AdminPanel title="Education">
      {error ? <p className="mb-4 text-sm text-red-400">{error}</p> : null}
      <CrudListEditor
        items={items}
        getKey={(i) => i.id}
        renderTitle={(i) => `${i.degree} — ${i.institution}`}
        onDelete={async (id) => {
          await adminDeleteEducation(id);
          await load();
          refresh();
        }}
        form={
          <CardiForm form={form} setForm={setForm} onAdd={() => void add()} />
        }
      />
    </AdminPanel>
  );
}

function CardiForm({
  form,
  setForm,
  onAdd,
}: {
  form: EduForm;
  setForm: (f: EduForm) => void;
  onAdd: () => void;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <AdminField label="Institution">
        <AdminInput
          value={form.institution}
          onChange={(e) => setForm({ ...form, institution: e.target.value })}
        />
      </AdminField>
      <AdminField label="Degree">
        <AdminInput
          value={form.degree}
          onChange={(e) => setForm({ ...form, degree: e.target.value })}
        />
      </AdminField>
      <AdminField label="Field of study">
        <AdminInput
          value={form.field_of_study}
          onChange={(e) => setForm({ ...form, field_of_study: e.target.value })}
        />
      </AdminField>
      <AdminField label="Start year">
        <AdminInput
          type="number"
          value={form.start_year}
          onChange={(e) => setForm({ ...form, start_year: e.target.value })}
        />
      </AdminField>
      <AdminField label="End year">
        <AdminInput
          type="number"
          value={form.end_year}
          onChange={(e) => setForm({ ...form, end_year: e.target.value })}
        />
      </AdminField>
      <div className="sm:col-span-2 space-y-4">
        <AdminField label="Description">
          <AdminTextarea
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </AdminField>
        <button
          type="button"
          onClick={onAdd}
          className="rounded-xl bg-accent px-5 py-2.5 text-sm font-medium text-white"
        >
          Add education
        </button>
      </div>
    </div>
  );
}