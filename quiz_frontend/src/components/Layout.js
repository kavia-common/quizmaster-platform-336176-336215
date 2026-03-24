import React from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

// PUBLIC_INTERFACE
export function Layout({ children }) {
  /** App shell with header nav and main content area. */
  const { status, user, actions } = useAuth();

  return (
    <div className="appShell">
      <header className="topbar">
        <div className="topbarInner">
          <Link to="/" className="brand">
            <span className="brandMark">QM</span>
            <span className="brandText">QuizMaster</span>
          </Link>

          <nav className="nav">
            <NavLink to="/" end className={({ isActive }) => isActive ? "navLink active" : "navLink"}>
              Quizzes
            </NavLink>
            <NavLink to="/results" className={({ isActive }) => isActive ? "navLink active" : "navLink"}>
              Results
            </NavLink>
            <NavLink to="/admin" className={({ isActive }) => isActive ? "navLink active" : "navLink"}>
              Admin
            </NavLink>
          </nav>

          <div className="authBox">
            {status === "authenticated" ? (
              <>
                <span className="userPill" title={user?.email || "Signed in"}>
                  {user?.email || "Signed in"}
                </span>
                <button className="btn btnSecondary" onClick={actions.logout}>
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link className="btn btnSecondary" to="/register">Sign up</Link>
                <Link className="btn" to="/login">Log in</Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="main">
        {children}
      </main>

      <footer className="footer">
        <div className="footerInner">
          <span className="muted">
            API: <code>{process.env.REACT_APP_API_BASE || process.env.REACT_APP_BACKEND_URL || "(not set)"}</code>
          </span>
        </div>
      </footer>
    </div>
  );
}
