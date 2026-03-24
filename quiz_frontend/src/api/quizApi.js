/**
 * Quiz backend API adapter.
 *
 * Flow name: QuizApiFlow
 * Single entrypoint module: quizApi (named exports)
 *
 * NOTE: Backend OpenAPI spec not available from current sources (no local spec; remote not reachable during build step).
 * This adapter uses conventional REST paths. If backend differs, update only this file to rewire the UI.
 */

import { requestJson } from "./httpClient";
import {
  mockAdminListQuestions,
  mockGetQuiz,
  mockListCategories,
  mockListQuizzesByCategory
} from "./mockData";

/**
 * Determines whether we should fall back to mock data.
 * We fall back when:
 * - backend call failed due to config/network, or
 * - backend returned non-ok.
 *
 * This keeps pages simple: they keep calling quizApi, and quizApi makes
 * best-effort to serve usable data.
 */
function shouldFallbackToMock(res) {
  return !res?.ok;
}

// PUBLIC_INTERFACE
export async function listCategories() {
  /** Returns a list of quiz categories. Falls back to mock dataset on failure. */
  const res = await requestJson("/categories");
  if (shouldFallbackToMock(res)) return mockListCategories();
  return res;
}

// PUBLIC_INTERFACE
export async function listQuizzesByCategory(categoryId) {
  /** Returns a list of quizzes in a category. Falls back to mock dataset on failure. */
  const res = await requestJson("/quizzes", { query: { categoryId } });
  if (shouldFallbackToMock(res)) return mockListQuizzesByCategory(categoryId);
  return res;
}

// PUBLIC_INTERFACE
export async function getQuiz(quizId) {
  /** Returns quiz details including questions (if backend provides). Falls back to mock dataset on failure. */
  const res = await requestJson(`/quizzes/${encodeURIComponent(quizId)}`);
  if (shouldFallbackToMock(res)) return mockGetQuiz(quizId);
  return res;
}

// PUBLIC_INTERFACE
export async function startQuiz(quizId) {
  /** Starts a quiz attempt. Expected to return attemptId and first question payload. */
  return requestJson(`/quizzes/${encodeURIComponent(quizId)}/start`, { method: "POST" });
}

// PUBLIC_INTERFACE
export async function submitAnswer(attemptId, questionId, answerId) {
  /** Submits an answer. Expected to return next question or completion info. */
  return requestJson(`/attempts/${encodeURIComponent(attemptId)}/answer`, {
    method: "POST",
    body: { questionId, answerId }
  });
}

// PUBLIC_INTERFACE
export async function completeAttempt(attemptId) {
  /** Completes attempt (if backend requires explicit completion). */
  return requestJson(`/attempts/${encodeURIComponent(attemptId)}/complete`, { method: "POST" });
}

/* Auth */

// PUBLIC_INTERFACE
export async function login(email, password) {
  /** Authenticates a user and returns {token, user}. */
  return requestJson("/auth/login", { method: "POST", body: { email, password } });
}

// PUBLIC_INTERFACE
export async function register(email, password) {
  /** Creates an account and returns {token, user}. */
  return requestJson("/auth/register", { method: "POST", body: { email, password } });
}

// PUBLIC_INTERFACE
export async function getMe(token) {
  /** Returns current user profile. */
  return requestJson("/auth/me", { token });
}

/* Admin (CRUD) */

// PUBLIC_INTERFACE
export async function adminListQuestions(token, quizId) {
  /** Lists questions (optionally by quiz). Falls back to mock dataset on failure. */
  const res = await requestJson("/admin/questions", { token, query: { quizId } });
  if (shouldFallbackToMock(res)) return mockAdminListQuestions(quizId);
  return res;
}

// PUBLIC_INTERFACE
export async function adminCreateQuestion(token, question) {
  /** Creates a question. */
  return requestJson("/admin/questions", { method: "POST", token, body: question });
}

// PUBLIC_INTERFACE
export async function adminUpdateQuestion(token, id, patch) {
  /** Updates a question by id. */
  return requestJson(`/admin/questions/${encodeURIComponent(id)}`, { method: "PUT", token, body: patch });
}

// PUBLIC_INTERFACE
export async function adminDeleteQuestion(token, id) {
  /** Deletes a question by id. */
  return requestJson(`/admin/questions/${encodeURIComponent(id)}`, { method: "DELETE", token });
}
