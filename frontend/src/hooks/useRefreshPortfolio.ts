import { usePortfolio } from "@/context/PortfolioContext";

export function useRefreshPortfolio() {
  const { reload } = usePortfolio();
  return () => void reload();
}