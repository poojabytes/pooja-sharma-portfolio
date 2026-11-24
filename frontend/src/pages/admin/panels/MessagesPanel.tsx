import { useCallback, useEffect, useState } from "react";
import { AdminPanel } from "@/components/admin/AdminField";
import LoadingState from "@/components/common/LoadingState";
import {
  adminDeleteMessage,
  adminListMessages,
  adminMarkMessageRead,
  type ContactMessage,
} from "@/services/admin.service";
import { formatDateTime } from "@/utils/format";

export default function MessagesPanel() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setMessages(await adminListMessages());
  }, []);

  useEffect(() => {
    void load().finally(() => setLoading(false));
  }, [load]);

  if (loading) return <LoadingState />;

  return (
    <AdminPanel title="Contact messages">
      {messages.length === 0 ? (
        <p className="bento-card text-sm text-muted">No messages yet.</p>
      ) : (
        <ul className="space-y-3">
          {messages.map((m) => (
            <MessageRow key={m.id} message={m} onChange={load} />
          ))}
        </ul>
      )}
    </AdminPanel>
  );
}

function MessageRow({
  message: m,
  onChange,
}: {
  message: ContactMessage;
  onChange: () => Promise<void>;
}) {
  return (
    <li
      className={[
        "bento-card",
        m.is_read ? "opacity-80" : "ring-1 ring-accent/30",
      ].join(" ")}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <p className="font-medium">{m.subject}</p>
          <p className="text-sm text-muted">
            {m.name} · {m.email}
          </p>
        </div>
        <div className="text-xs text-muted">{formatDateTime(m.created_at)}</div>
      </div>
      <p className="mt-3 whitespace-pre-wrap text-sm text-muted">{m.message}</p>
      <div className="mt-4 flex gap-2 text-xs">
        {!m.is_read ? (
          <button
            type="button"
            onClick={() => void adminMarkMessageRead(m.id).then(onChange)}
            className="rounded-lg border border-border px-3 py-1.5"
          >
            Mark read
          </button>
        ) : null}
        <button
          type="button"
          onClick={() => void adminDeleteMessage(m.id).then(onChange)}
          className="rounded-lg border border-border px-3 py-1.5 text-red-300"
        >
          Delete
        </button>
      </div>
    </li>
  );
}