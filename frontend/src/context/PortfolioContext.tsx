import { createContext, useContext, type ReactNode } from "react";
import { usePortfolioData } from "@/hooks/usePortfolioData";
import type { PortfolioSnapshot } from "@/services/portfolio.service";

type PortfolioContextValue = ReturnType<typeof usePortfolioData>;

const PortfolioContext = createContext<PortfolioContextValue | null>(null);

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const value = usePortfolioData();
  return (
    <PortfolioContext.Provider value={value}>{children}</PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const ctx = useContext(PortfolioContext);
  if (!ctx) throw new Error("usePortfolio must be used within PortfolioProvider");
  return ctx;
}

export type { PortfolioSnapshot };