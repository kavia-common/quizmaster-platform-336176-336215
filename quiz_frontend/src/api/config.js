/**
 * Centralized API configuration.
 *
 * Contract:
 * - Reads REACT_APP_API_BASE (preferred) or REACT_APP_BACKEND_URL.
 * - Returns normalized URLs (no trailing slash).
 * - Does not throw; returns empty strings if misconfigured, and callers should surface errors.
 */

// PUBLIC_INTERFACE
export function getApiBaseUrl() {
  /** Returns the API base URL to be used for HTTP requests. */
  const raw = (process.env.REACT_APP_API_BASE || process.env.REACT_APP_BACKEND_URL || "").trim();
  return raw.replace(/\/+$/, "");
}

// PUBLIC_INTERFACE
export function getWebSocketUrl() {
  /** Returns the WebSocket base URL (if configured) for realtime features. */
  const raw = (process.env.REACT_APP_WS_URL || "").trim();
  return raw.replace(/\/+$/, "");
}
