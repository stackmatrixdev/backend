import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

export function PrivateRoute({ children, allowedRoles = ["user", "admin"] }) {
  const location = useLocation();
  const auth = useSelector((state) => state.auth);

  const accessToken = auth?.accessToken;
  const refreshToken = auth?.refreshToken;
  const isAuthenticated = auth?.isAuthenticated;
  const userRole = auth?.user?.role;

  // Check if user is not authenticated
  if (!accessToken && !refreshToken) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user is not verified
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user role is allowed for this route
  if (userRole && !allowedRoles.includes(userRole)) {
    // If admin tries to access regular user routes, redirect to admin dashboard
    if (userRole === "admin") {
      return <Navigate to="/admin" replace />;
    }
    // If regular user tries to access admin routes, redirect to home
    return <Navigate to="/" replace />;
  }

  // User meets all requirements
  return children;
}

// Admin-only route component
export function AdminRoute({ children }) {
  const location = useLocation();
  const auth = useSelector((state) => state.auth);

  const accessToken = auth?.accessToken;
  const refreshToken = auth?.refreshToken;
  const isAuthenticated = auth?.isAuthenticated;
  const userRole = auth?.user?.role;

  // Check if user is not authenticated
  if (!accessToken && !refreshToken) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user is not verified
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user is admin
  if (userRole !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}
