import { Link } from "react-router-dom";
import Seo from "@/components/common/Seo";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <Seo title="404 | Pooja Sharma" />
      <h1 className="text-6xl font-semibold text-accent">404</h1>
      <p className="mt-4 text-muted">This page could not be found.</p>
      <Link
        to="/"
        className="mt-8 rounded-lg bg-surface px-4 py-2 text-sm font-medium ring-1 ring-border transition hover:ring-accent/50"
      >
        Back to home
      </Link>
    </main>
  );
}