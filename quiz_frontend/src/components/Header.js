import React from "react";
import { NavLink } from "react-router-dom";

/**
 * Header component contract:
 * - Inputs: none (pure presentational component)
 * - Outputs: renders a top navigation bar with client-side navigation links
 * - Errors: none expected
 * - Side effects: none (no I/O, no state)
 */
// PUBLIC_INTERFACE
export default function Header() {
  /** Minimal application header with primary navigation. */
  return (
    <header className="topBar">
      <div className="brand">
        <div className="logoMark" aria-hidden="true" />
        <NavLink to="/" className="brandName" aria-label="Quizmaster Home">
          Quizmaster
        </NavLink>
      </div>

      <nav className="nav" aria-label="Primary">
        <NavLink
          className={({ isActive }) =>
            `navLink${isActive ? " navLinkActive" : ""}`
          }
          to="/"
          end
        >
          Home
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            `navLink${isActive ? " navLinkActive" : ""}`
          }
          to="/categories"
        >
          Categories
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            `navLink${isActive ? " navLinkActive" : ""}`
          }
          to="/admin"
        >
          Admin
        </NavLink>
      </nav>
    </header>
  );
}
