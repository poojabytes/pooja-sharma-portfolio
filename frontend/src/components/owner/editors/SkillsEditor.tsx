import { useState } from "react";
import { Trash2 } from "lucide-react";
import { OwnerEditPanel } from "@/components/owner/OwnerOnly";
import { OwnerField, OwnerInput } from "@/components/owner/OwnerField";
import { SKILL_CATEGORIES } from "@/constants/skills";
import { useToast } from "@/context/ToastContext";
import { useRefreshPortfolio } from "@/hooks/useRefreshPortfolio";
import { ownerCreateSkill, ownerDeleteSkill } from "@/services/owner.service";
import { getApiErrorMessage } from "@/utils/apiError";
import type { Skill } from "@/types/portfolio";

type Props = { skills: Skill[] };

export default function SkillsEditor({ skills }: Props) {
  const refresh = useRefreshPortfolio();
  const toast = useToast();
  const [name, setName] = useState("");
  const [category, setCategory] = useState<string>(SKILL_CATEGORIES[0]);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const add = async () => {
    if (!name.trim()) return;
    setBusy(true);
    setError(null);
    try {
      await ownerCreateSkill({ name: name.trim(), category, display_order: skills.length });
      setName("");
      refresh();
      toast.push("success", "Skill added");
    } catch (err) {
      setError(getApiErrorMessage(err, "Could not add skill"));
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id: number) => {
    setBusy(true);
    setError(null);
    try {
      await ownerDeleteSkill(id);
      refresh();
      toast.push("success", "Skill removed");
    } catch (err) {
      setError(getApiErrorMessage(err, "Delete failed"));
    } finally {
      setBusy(false);
    }
  };

  return (
    <OwnerEditPanel title="skills">
      <div className="grid gap-4 sm:grid-cols-2">
        <OwnerField label="Skill name">
          <OwnerInput value={name} onChange={(e) => setName(e.target.value)} />
        </OwnerField>
        <OwnerField label="Category">
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
        </OwnerField>
      </div>
      <button type="button" onClick={() => void add()} disabled={busy} className="btn-primary">
        Add skill
      </button>
      {error ? <p className="text-sm text-red-500">{error}</p> : null}
      <ul className="space-y-2">
        {skills.map((s) => (
          <li
            key={s.id}
            className="flex items-center justify-between gap-3 rounded-xl border border-border bg-background px-3 py-2"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{s.name}</p>
              <p className="truncate text-xs text-muted">{s.category}</p>
            </div>
            <button
              type="button"
              disabled={busy}
              onClick={() => void remove(s.id)}
              className="rounded-lg border border-border p-2 text-muted hover:text-red-500"
              aria-label={`Delete ${s.name}`}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </li>
        ))}
      </ul>
    </OwnerEditPanel>
  );
}
