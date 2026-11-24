import { AlertCircle } from "lucide-react";

type Props = {
  message: string;
  onRetry?: () => void;
};

export default function ErrorState({ message, onRetry }: Props) {
  return (
    <div className="bento-card mx-auto flex max-w-lg flex-col items-center gap-4 text-center">
      <AlertCircle className="h-10 w-10 text-accent" aria-hidden />
      <p className="text-sm text-muted">{message}</p>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-on-accent transition hover:opacity-90"
        >
          Retry
        </button>
      ) : null}
    </div>
  );
}