import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getMe, login as apiLogin, register as apiRegister } from "../api/quizApi";

const AuthContext = createContext(null);

const LS_KEY = "quizmaster.auth.v1";

/**
 * Flow name: AuthFlow
 * Single entrypoint: <AuthProvider>
 *
 * Contract:
 * - Provides { user, token, status, error, actions }.
 * - status: "anonymous" | "restoring" | "authenticated"
 * - Persists token+user to localStorage.
 * - All screens call actions; no screen should call localStorage directly.
 */

// PUBLIC_INTERFACE
export function AuthProvider({ children }) {
  /** Provides authentication state and actions to descendants. */
  const [token, setToken] = useState("");
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState("restoring");
  const [error, setError] = useState(null);

  const restore = useCallback(async () => {
    setError(null);
    setStatus("restoring");

    try {
      const raw = localStorage.getItem(LS_KEY);
      if (!raw) {
        setToken("");
        setUser(null);
        setStatus("anonymous");
        return;
      }
      const parsed = JSON.parse(raw);
      if (!parsed?.token) {
        localStorage.removeItem(LS_KEY);
        setToken("");
        setUser(null);
        setStatus("anonymous");
        return;
      }
      // Validate token by calling /auth/me; if it fails, clear.
      const res = await getMe(parsed.token);
      if (!res.ok) {
        localStorage.removeItem(LS_KEY);
        setToken("");
        setUser(null);
        setStatus("anonymous");
        setError(res.error);
        return;
      }
      setToken(parsed.token);
      setUser(res.data?.user || res.data); // tolerate different shapes
      setStatus("authenticated");
    } catch (e) {
      setToken("");
      setUser(null);
      setStatus("anonymous");
      setError({ message: "Failed to restore session.", details: { message: e?.message } });
    }
  }, []);

  useEffect(() => {
    restore();
  }, [restore]);

  const persist = useCallback((nextToken, nextUser) => {
    localStorage.setItem(LS_KEY, JSON.stringify({ token: nextToken, user: nextUser }));
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(LS_KEY);
    setToken("");
    setUser(null);
    setStatus("anonymous");
    setError(null);
  }, []);

  const login = useCallback(async (email, password) => {
    setError(null);
    const res = await apiLogin(email, password);
    if (!res.ok) {
      setError(res.error);
      return res;
    }
    const nextToken = res.data?.token || res.data?.access_token || "";
    const nextUser = res.data?.user || null;
    setToken(nextToken);
    setUser(nextUser);
    setStatus("authenticated");
    persist(nextToken, nextUser);
    return res;
  }, [persist]);

  const register = useCallback(async (email, password) => {
    setError(null);
    const res = await apiRegister(email, password);
    if (!res.ok) {
      setError(res.error);
      return res;
    }
    const nextToken = res.data?.token || res.data?.access_token || "";
    const nextUser = res.data?.user || null;
    setToken(nextToken);
    setUser(nextUser);
    setStatus("authenticated");
    persist(nextToken, nextUser);
    return res;
  }, [persist]);

  const value = useMemo(() => ({
    user,
    token,
    status,
    error,
    actions: { restore, login, register, logout }
  }), [user, token, status, error, restore, login, register, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// PUBLIC_INTERFACE
export function useAuth() {
  /** Hook to access auth state and actions. */
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

// PUBLIC_INTERFACE
export function isAdminUser(user) {
  /** Returns true if the user object indicates admin privileges. */
  const role = user?.role || user?.type;
  return role === "admin" || user?.isAdmin === true;
}
