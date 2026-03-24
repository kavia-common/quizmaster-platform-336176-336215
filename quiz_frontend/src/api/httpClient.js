/**
 * Lightweight HTTP client around fetch with consistent behavior.
 *
 * Flow name: HttpRequestFlow
 * Single entrypoint: requestJson()
 *
 * Contract:
 * Inputs:
 * - path: string (e.g. "/quizzes")
 * - options: { method, body, token, query, headers, signal }
 * Output:
 * - { ok: true, status, data, headers }
 * - { ok: false, status, error: { message, details, code } }
 * Errors:
 * - Network errors => ok:false, status:0
 * Side effects:
 * - Performs network calls to backend.
 */

import { getApiBaseUrl } from "./config";

// PUBLIC_INTERFACE
export async function requestJson(path, options = {}) {
  /** Performs a JSON request to `${API_BASE}${path}` with consistent error handling. */
  const {
    method = "GET",
    body,
    token,
    query,
    headers = {},
    signal
  } = options;

  const base = getApiBaseUrl();
  if (!base) {
    return {
      ok: false,
      status: 0,
      error: {
        code: "CONFIG_ERROR",
        message: "API base URL is not configured. Set REACT_APP_API_BASE or REACT_APP_BACKEND_URL.",
        details: { envKeys: ["REACT_APP_API_BASE", "REACT_APP_BACKEND_URL"] }
      }
    };
  }

  const url = new URL(base + (path.startsWith("/") ? path : `/${path}`));
  if (query && typeof query === "object") {
    Object.entries(query).forEach(([k, v]) => {
      if (v === undefined || v === null) return;
      url.searchParams.set(k, String(v));
    });
  }

  const reqHeaders = {
    Accept: "application/json",
    ...headers
  };

  let reqBody;
  if (body !== undefined) {
    reqHeaders["Content-Type"] = "application/json";
    reqBody = JSON.stringify(body);
  }

  if (token) {
    reqHeaders.Authorization = `Bearer ${token}`;
  }

  const startedAt = Date.now();
  try {
    const res = await fetch(url.toString(), {
      method,
      headers: reqHeaders,
      body: reqBody,
      signal
    });

    const contentType = res.headers.get("content-type") || "";
    const isJson = contentType.includes("application/json");

    let payload;
    try {
      payload = isJson ? await res.json() : await res.text();
    } catch (e) {
      payload = null;
    }

    if (!res.ok) {
      return {
        ok: false,
        status: res.status,
        error: {
          code: "HTTP_ERROR",
          message: (payload && payload.message) || `Request failed with status ${res.status}`,
          details: payload
        },
        meta: { ms: Date.now() - startedAt, url: url.toString(), method }
      };
    }

    return {
      ok: true,
      status: res.status,
      data: payload,
      headers: Object.fromEntries(res.headers.entries()),
      meta: { ms: Date.now() - startedAt, url: url.toString(), method }
    };
  } catch (e) {
    return {
      ok: false,
      status: 0,
      error: {
        code: "NETWORK_ERROR",
        message: "Network error while calling backend API.",
        details: { name: e?.name, message: e?.message }
      },
      meta: { ms: Date.now() - startedAt, url: url.toString(), method }
    };
  }
}
