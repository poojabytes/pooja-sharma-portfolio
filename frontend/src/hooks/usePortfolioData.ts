import { useCallback, useEffect, useState } from "react";
import {
  fetchPortfolioSnapshot,
  type PortfolioSnapshot,
} from "@/services/portfolio.service";

const empty: PortfolioSnapshot = {
  profile: null,
  publicSettings: {},
  socialLinks: [],
  skills: [],
  projects: [],
  featuredProjects: [],
  experience: [],
  education: [],
  certificates: [],
  resume: null,
};

export function usePortfolioData() {
  const [data, setData] = useState<PortfolioSnapshot>(empty);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const snapshot = await fetchPortfolioSnapshot();
      setData(snapshot);
    } catch {
      setError("Unable to load portfolio data. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { data, loading, error, reload };
}