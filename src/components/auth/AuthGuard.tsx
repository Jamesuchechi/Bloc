import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppStore } from "../../store/appStore";

export function AuthGuard() {
  const { user, isAuthLoading } = useAppStore();
  const location = useLocation();

  if (isAuthLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink">
        <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-amber" />
      </div>
    );
  }

  if (!user) {
    // Redirect to login but save the current location they were trying to go to
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
