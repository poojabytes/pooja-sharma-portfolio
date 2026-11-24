import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AdminPanel } from "@/components/admin/AdminField";
import LoadingState from "@/components/common/LoadingState";
import { adminGetOverview } from "@/services/admin.service";
import { getApiErrorMessage } from "@/utils/apiError";

export default function OverviewPanel() {
  const [name, setName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      try {
        const data = await adminGetOverview();
        setName(data.name);
      } catch (err) {
        setError(getApiErrorMessage(err, "Could not load overview"));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <LoadingState />;
  if (error) return <p className="text-sm text-red-400">{error}</p>;

  return (
    <AdminPanel title="Overview" description="Manage portfolio content from the sidebar.">
      <div className="bento-card">
        <p className="text-sm text-muted">Signed in as admin for</p>
        <p className="mt-2 text-xl font-semibold">{name}</p>
        <p className="mt-4 text-sm text-muted">
          Changes save to the API and appear on the public site immediately.
        </p>
        <Link
          to="/"
          className="mt-6 inline-block text-sm text-accent hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          View public site →
        </Link>
      </div>
    </AdminPanel>
  );
}