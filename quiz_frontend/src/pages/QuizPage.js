import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { completeAttempt, getQuiz, startQuiz, submitAnswer } from "../api/quizApi";
import { Alert, Card } from "../components/Ui";

const LS_RESULTS = "quizmaster.results.v1";

function normalizeQuestions(payload) {
  const quiz = payload?.quiz || payload;
  const questions = quiz?.questions || payload?.questions || [];
  return Array.isArray(questions) ? questions : [];
}

function normalizeTitle(payload) {
  const quiz = payload?.quiz || payload;
  return quiz?.title || quiz?.name || "Quiz";
}

function persistLatestResult(result) {
  const existingRaw = localStorage.getItem(LS_RESULTS);
  const existing = existingRaw ? JSON.parse(existingRaw) : [];
  const next = [result, ...(Array.isArray(existing) ? existing : [])].slice(0, 20);
  localStorage.setItem(LS_RESULTS, JSON.stringify(next));
}

// PUBLIC_INTERFACE
export default function QuizPage() {
  /** Screen for taking a quiz and submitting answers. */
  const { quizId } = useParams();
  const navigate = useNavigate();

  const [quizState, setQuizState] = useState({ status: "loading", title: "", questions: [], error: null });
  const [attempt, setAttempt] = useState({ status: "idle", attemptId: "", index: 0, answers: {}, score: 0, done: false });
  const [actionError, setActionError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setQuizState({ status: "loading", title: "", questions: [], error: null });
      const res = await getQuiz(quizId);
      if (cancelled) return;
      if (!res.ok) {
        setQuizState({ status: "error", title: "", questions: [], error: res.error });
        return;
      }
      setQuizState({
        status: "ready",
        title: normalizeTitle(res.data),
        questions: normalizeQuestions(res.data),
        error: null
      });
    })();

    return () => { cancelled = true; };
  }, [quizId]);

  const start = useCallback(async () => {
    setActionError(null);
    setSubmitting(true);
    const res = await startQuiz(quizId);
    setSubmitting(false);

    if (!res.ok) {
      setActionError(res.error);
      return;
    }

    const attemptId = res.data?.attemptId || res.data?.id || res.data?.attempt_id || "";
    setAttempt({ status: "active", attemptId, index: 0, answers: {}, score: 0, done: false });
  }, [quizId]);

  const questions = quizState.questions || [];
  const currentQuestion = questions[attempt.index];

  const selectAnswer = useCallback(async (answerId) => {
    if (!currentQuestion || submitting) return;

    setActionError(null);
    setSubmitting(true);

    const questionId = currentQuestion.id || currentQuestion.questionId;
    const prevAnswers = attempt.answers;

    // If backend has attempt endpoints, use them; otherwise do local scoring.
    const canCallBackend = Boolean(attempt.attemptId);

    let nextScore = attempt.score;
    let wasCorrect = undefined;

    if (currentQuestion.correctAnswerId !== undefined) {
      wasCorrect = String(answerId) === String(currentQuestion.correctAnswerId);
      if (wasCorrect) nextScore += 1;
    }

    if (canCallBackend) {
      const res = await submitAnswer(attempt.attemptId, questionId, answerId);
      setSubmitting(false);
      if (!res.ok) {
        setActionError(res.error);
        return;
      }

      // Backend might return updated score/completion; we tolerate absence.
      nextScore = res.data?.score ?? nextScore;
    } else {
      setSubmitting(false);
    }

    const nextIndex = attempt.index + 1;
    const done = nextIndex >= questions.length;

    const nextAttempt = {
      ...attempt,
      status: done ? "done" : "active",
      index: done ? attempt.index : nextIndex,
      done,
      score: nextScore,
      answers: { ...prevAnswers, [String(questionId)]: { answerId, wasCorrect } }
    };

    setAttempt(nextAttempt);

    if (done) {
      // Best-effort completion call.
      if (attempt.attemptId) {
        await completeAttempt(attempt.attemptId);
      }

      const result = {
        id: `${quizId}:${Date.now()}`,
        quizId,
        title: quizState.title,
        total: questions.length,
        score: nextScore,
        takenAt: new Date().toISOString()
      };
      persistLatestResult(result);
      navigate("/results", { replace: true });
    }
  }, [attempt, currentQuestion, navigate, questions.length, quizId, quizState.title, submitting]);

  const progressText = useMemo(() => {
    if (quizState.status !== "ready") return "";
    if (!questions.length) return "No questions available.";
    const idx = Math.min(attempt.index + 1, questions.length);
    return `Question ${idx} of ${questions.length}`;
  }, [attempt.index, questions.length, quizState.status]);

  return (
    <div className="container">
      <div className="pageHeader">
        <div>
          <h1 className="h1">{quizState.title || "Quiz"}</h1>
          <p className="muted">{progressText}</p>
        </div>
        <div className="pageHeaderActions">
          <Link className="btn btnSecondary" to="/">Back</Link>
          {attempt.status === "idle" ? (
            <button className="btn" onClick={start} disabled={submitting || quizState.status !== "ready"}>
              Start quiz
            </button>
          ) : null}
        </div>
      </div>

      {quizState.status === "error" ? (
        <Alert kind="error" title="Failed to load quiz">
          <pre className="codeBlock">{JSON.stringify(quizState.error, null, 2)}</pre>
        </Alert>
      ) : null}

      {actionError ? (
        <Alert kind="error" title="Action failed">
          <pre className="codeBlock">{JSON.stringify(actionError, null, 2)}</pre>
        </Alert>
      ) : null}

      {quizState.status === "ready" && questions.length === 0 ? (
        <Alert kind="warning" title="No questions">
          This quiz doesn’t have questions yet.
        </Alert>
      ) : null}

      {quizState.status === "ready" && questions.length > 0 ? (
        <Card
          title={currentQuestion?.text || currentQuestion?.prompt || "Quiz in progress"}
          subtitle={currentQuestion?.description || ""}
          actions={submitting ? <span className="muted">Submitting…</span> : null}
        >
          <div className="options">
            {(currentQuestion?.answers || currentQuestion?.options || []).map(opt => {
              const id = opt.id ?? opt.value ?? opt.key;
              const label = opt.text ?? opt.label ?? String(opt.value ?? opt.id);
              return (
                <button
                  key={String(id)}
                  className="optionBtn"
                  onClick={() => selectAnswer(id)}
                  disabled={submitting}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {!Array.isArray(currentQuestion?.answers) && !Array.isArray(currentQuestion?.options) ? (
            <Alert kind="info" title="Backend shape mismatch">
              This UI expects the quiz payload to include <code>questions[].answers</code> or <code>questions[].options</code>.
              Update the backend or adjust <code>normalizeQuestions</code> in this page.
            </Alert>
          ) : null}
        </Card>
      ) : null}
    </div>
  );
}
