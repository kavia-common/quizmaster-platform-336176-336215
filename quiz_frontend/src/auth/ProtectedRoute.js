import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { isAdminUser, useAuth } from "./AuthContext";

/**
 * Contract:
 * - If `requireAdmin` is true, user must be authenticated and admin.
 * - Otherwise, user must be authenticated.
 */

// PUBLIC_INTERFACE
export function ProtectedRoute({ requireAdmin = false }) {
  /** Route guard for authenticated (and optionally admin) pages. */
  const { status, user } = useAuth();
  const location = useLocation();

  if (status === "restoring") {
    return (
      <div className="container">
        <div className="card">
          <div className="skeleton-line" />
          <div className="skeleton-line" />
          <p className="muted">Restoring session…</p>
        </div>
      </div>
    );
  }

  if (status !== "authenticated") {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (requireAdmin && !isAdminUser(user)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
