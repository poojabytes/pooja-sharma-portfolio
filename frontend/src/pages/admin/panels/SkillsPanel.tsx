import { useCallback, useEffect, useState } from "react";
import { AdminField, AdminInput, AdminPanel } from "@/components/admin/AdminField";
import CrudListEditor from "@/components/admin/CrudListEditor";
import LoadingState from "@/components/common/LoadingState";
import { SKILL_CATEGORIES } from "@/constants/adminNav";
import {
  adminCreateSkill,
  adminDeleteSkill,
  adminListSkills,
} from "@/services/admin.service";
import { useRefreshPortfolio } from "@/hooks/useRefreshPortfolio";
import { getApiErrorMessage } from "@/utils/apiError";
import type { Skill } from "@/types/portfolio";

export default function SkillsPanel() {
  const refresh = useRefreshPortfolio();
  const [items, setItems] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [category, setCategory] = useState<string>(SKILL_CATEGORIES[0]);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setItems(await adminListSkills());
  }, []);

  useEffect(() => {
    void load().finally(() => setLoading(false));
  }, [load]);

  const add = async () => {
    if (!name.trim()) return;
    setError(null);
    try {
      await adminCreateSkill({ name, category, display_order: items.length });
      setName("");
      await load();
      refresh();
    } catch (err) {
      setError(getApiErrorMessage(err, "Could not add skill"));
    }
  };

  if (loading) return <LoadingState />;

  return (
    <AdminPanel title="Skills" description="Grouped on the public skills section.">
      {error ? <p className="mb-4 text-sm text-red-400">{error}</p> : null}
      <CrudListEditor
        items={items}
        getKey={(i) => i.id}
        renderTitle={(i) => i.name}
        renderSubtitle={(i) => i.category}
        onDelete={async (id) => {
          await adminDeleteSkill(id);
          await load();
          refresh();
        }}
        form={
          <div className="grid gap-4 sm:grid-cols-2">
            <AdminField label="Skill name">
              <AdminInput value={name} onChange={(e) => setName(e.target.value)} />
            </AdminField>
            <AdminField label="Category">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
              >
                {SKILL_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </AdminField>
            <div className="sm:col-span-2">
              <button
                type="button"
                onClick={() => void add()}
                className="rounded-xl bg-accent px-5 py-2.5 text-sm font-medium text-white"
              >
                Add skill
              </button>
            </div>
          </div>
        }
      />
    </AdminPanel>
  );
}