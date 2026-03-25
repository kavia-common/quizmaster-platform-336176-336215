import React from "react";
import { NavLink, useLocation } from "react-router-dom";

/**
 * CategoriesSidebar contract:
 * - Inputs:
 *   - categories?: Array<{ id: string, label: string }>
 * - Outputs:
 *   - Renders a sidebar navigation list for categories.
 * - Errors:
 *   - None expected (falls back to a safe default list if categories are missing/invalid).
 * - Side effects:
 *   - None (pure UI component).
 *
 * Notes:
 * - This component is intentionally static for now. Later it can be wired to backend data
 *   by passing a categories prop from a higher-level data flow.
 */

const DEFAULT_CATEGORIES = Object.freeze([
  { id: "general", label: "General Knowledge" },
  { id: "science", label: "Science" },
  { id: "history", label: "History" },
  { id: "sports", label: "Sports" },
  { id: "music", label: "Music" },
  { id: "movies", label: "Movies" },
]);

function normalizeCategories(categories) {
  if (!Array.isArray(categories) || categories.length === 0) {
    return DEFAULT_CATEGORIES;
  }

  // Keep it robust: only accept items with string id/label; otherwise fallback to defaults.
  const cleaned = categories
    .filter(
      (item) =>
        item &&
        typeof item === "object" &&
        typeof item.id === "string" &&
        typeof item.label === "string"
    )
    .map((item) => ({ id: item.id, label: item.label }));

  return cleaned.length > 0 ? cleaned : DEFAULT_CATEGORIES;
}

// PUBLIC_INTERFACE
export default function CategoriesSidebar({ categories }) {
  /** Minimal categories sidebar navigation. */
  const location = useLocation();
  const normalized = normalizeCategories(categories);

  // When we later add category filtering, these links can route to something like:
  // /categories?category=science or /categories/science
  // For now, we keep them as inert UI links pointing at /categories.
  const isCategoriesPage = location.pathname.startsWith("/categories");

  return (
    <aside className="sidebar" aria-label="Quiz categories">
      <div className="sidebarHeader">
        <div className="sidebarTitleRow">
          <span className="sidebarTitle">Categories</span>
          <span className="sidebarBadge" aria-label="Static list for now">
            Static
          </span>
        </div>
        <p className="sidebarSubtitle">
          Choose a topic to browse quizzes (backend wiring coming next).
        </p>
      </div>

      <nav className="sidebarNav" aria-label="Category list">
        {normalized.map((cat) => (
          <NavLink
            key={cat.id}
            to="/categories"
            className={() =>
              `sidebarLink${isCategoriesPage ? " sidebarLinkActive" : ""}`
            }
            aria-current={isCategoriesPage ? "page" : undefined}
          >
            <span className="sidebarLinkDot" aria-hidden="true" />
            <span className="sidebarLinkText">{cat.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
