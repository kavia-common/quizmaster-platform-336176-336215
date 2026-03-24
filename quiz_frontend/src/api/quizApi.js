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

// PUBLIC_INTERFACE
export async function listCategories() {
  /** Returns a list of quiz categories. */
  return requestJson("/categories");
}

// PUBLIC_INTERFACE
export async function listQuizzesByCategory(categoryId) {
  /** Returns a list of quizzes in a category. */
  return requestJson("/quizzes", { query: { categoryId } });
}

// PUBLIC_INTERFACE
export async function getQuiz(quizId) {
  /** Returns quiz details including questions (if backend provides). */
  return requestJson(`/quizzes/${encodeURIComponent(quizId)}`);
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
  /** Lists questions (optionally by quiz). */
  return requestJson("/admin/questions", { token, query: { quizId } });
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
