import { Navigate, Outlet, useLocation } from "react-router-dom";
import LoadingState from "@/components/common/LoadingState";
import { useAuth } from "@/context/AuthContext";

export default function ProtectedAdminRoute() {
  const { admin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingState label="Checking session..." />
      </div>
    );
  }

  if (!admin) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}