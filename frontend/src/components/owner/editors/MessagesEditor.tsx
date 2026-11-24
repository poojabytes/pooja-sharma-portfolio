import { useCallback, useEffect, useState } from "react";
import { OwnerEditPanel } from "@/components/owner/OwnerOnly";
import {
  ownerDeleteMessage,
  ownerListMessages,
  ownerMarkMessageRead,
  type ContactMessage,
} from "@/services/owner.service";
import { formatDateTime } from "@/utils/format";
import { getApiErrorMessage } from "@/utils/apiError";

export default function MessagesEditor() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setMessages(await ownerListMessages());
  }, []);

  useEffect(() => {
    void load()
      .catch((err) => setError(getApiErrorMessage(err, "Could not load messages")))
      .finally(() => setLoading(false));
  }, [load]);

  return (
    <OwnerEditPanel title="contact messages">
      {loading ? <p className="text-sm text-muted">Loading messages...</p> : null}
      {error ? <p className="text-sm text-red-500">{error}</p> : null}
      {!loading && messages.length === 0 ? (
        <p className="text-sm text-muted">No messages yet.</p>
      ) : null}
      <ul className="space-y-3">
        {messages.map((m) => (
          <li
            key={m.id}
            className={[
              "rounded-xl border border-border bg-background p-3",
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
              <p className="text-xs text-muted">{formatDateTime(m.created_at)}</p>
            </div>
            <p className="mt-3 whitespace-pre-wrap text-sm text-muted">{m.message}</p>
            <div className="mt-3 flex gap-2 text-xs">
              {!m.is_read ? (
                <button
                  type="button"
                  className="rounded-lg border border-border px-3 py-1.5"
                  onClick={() => void ownerMarkMessageRead(m.id).then(load)}
                >
                  Mark read
                </button>
              ) : null}
              <button
                type="button"
                className="rounded-lg border border-border px-3 py-1.5 text-red-500"
                onClick={() => void ownerDeleteMessage(m.id).then(load)}
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
