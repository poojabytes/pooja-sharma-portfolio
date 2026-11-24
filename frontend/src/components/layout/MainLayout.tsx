import { Outlet } from "react-router-dom";
import { usePortfolio } from "@/context/PortfolioContext";
import SiteSettingsSync from "@/components/common/SiteSettingsSync";
import Footer from "./Footer";
import Navbar from "./Navbar";

export default function MainLayout() {
  const { data } = usePortfolio();

  return (
    <div className="flex min-h-screen flex-col">
      <SiteSettingsSync />
      <Navbar />
      <main className="flex-1">
        <Outlet context={data} />
      </main>
      <Footer
        socialLinks={data.socialLinks}
        email={data.profile?.email}
      />
    </div>
  );
}