import { useState, type ReactNode } from "react";
import { Trash2 } from "lucide-react";

type Props<T> = {
  items: T[];
  getKey: (item: T) => number;
  renderTitle: (item: T) => string;
  renderSubtitle?: (item: T) => string;
  onDelete: (id: number) => Promise<void>;
  form: ReactNode;
};

export default function CrudListEditor<T>({
  items,
  getKey,
  renderTitle,
  renderSubtitle,
  onDelete,
  form,
}: Props<T>) {
  const [deletingId, setDeletingId] = useState<number | null>(null);

  return (
    <div className="space-y-6">
      <div className="bento-card">{form}</div>
      <ul className="space-y-2">
        {items.map((item) => {
          const id = getKey(item);
          return (
            <li
              key={id}
              className="flex items-center justify-between gap-3 rounded-xl border border-border bg-surface px-4 py-3"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{renderTitle(item)}</p>
                {renderSubtitle ? (
                  <p className="truncate text-xs text-muted">{renderSubtitle(item)}</p>
                ) : null}
              </div>
              <button
                type="button"
                disabled={deletingId === id}
                onClick={() => {
                  setDeletingId(id);
                  void onDelete(id).finally(() => setDeletingId(null));
                }}
                className="rounded-lg border border-border p-2 text-muted transition hover:border-red-400/50 hover:text-red-300"
                aria-label="Delete"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}