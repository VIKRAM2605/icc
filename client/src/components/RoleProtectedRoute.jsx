import { Navigate, Outlet } from "react-router-dom";
import { hasAnyRole, isAuthenticated } from "../utils/auth";

export default function RoleProtectedRoute({ allowedRoles = [] }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (!hasAnyRole(allowedRoles)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}
