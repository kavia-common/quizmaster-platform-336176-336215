import React, { useMemo, useReducer } from "react";

/**
 * QuizRunnerFlow contract (reusable flow, not a one-off patch):
 * - Inputs:
 *   - questionBank: Array<{
 *       id: string,
 *       prompt: string,
 *       options: Array<{ id: string, text: string }>,
 *       correctOptionId: string
 *     }>
 * - Outputs:
 *   - UI state transitions: answer selection, next question, completion summary, restart.
 * - Invariants:
 *   - Exactly one option id is correct per question
 *   - options ids are unique within a question
 *   - score is an integer in range [0, questionCount]
 * - Errors:
 *   - Invalid question bank throws (developer error); surfaced in console and stops render.
 * - Side effects:
 *   - No network I/O; all in-memory state only.
 */

const STATIC_QUESTION_BANK = Object.freeze([
  {
    id: "q1",
    prompt: "Which planet is known as the Red Planet?",
    options: [
      { id: "a", text: "Venus" },
      { id: "b", text: "Mars" },
      { id: "c", text: "Jupiter" },
      { id: "d", text: "Mercury" },
    ],
    correctOptionId: "b",
  },
  {
    id: "q2",
    prompt: "What does HTML stand for?",
    options: [
      { id: "a", text: "Hyperlinks and Text Markup Language" },
      { id: "b", text: "Home Tool Markup Language" },
      { id: "c", text: "HyperText Markup Language" },
      { id: "d", text: "Hyper Transfer Markup Language" },
    ],
    correctOptionId: "c",
  },
  {
    id: "q3",
    prompt: "Which of these is a prime number?",
    options: [
      { id: "a", text: "21" },
      { id: "b", text: "39" },
      { id: "c", text: "49" },
      { id: "d", text: "29" },
    ],
    correctOptionId: "d",
  },
]);

function assertValidQuestionBank(questionBank) {
  if (!Array.isArray(questionBank) || questionBank.length === 0) {
    throw new Error("QuizRunnerFlow: questionBank must be a non-empty array.");
  }

  for (const q of questionBank) {
    if (!q || typeof q !== "object") {
      throw new Error("QuizRunnerFlow: each question must be an object.");
    }
    if (typeof q.id !== "string" || q.id.length === 0) {
      throw new Error("QuizRunnerFlow: question.id must be a non-empty string.");
    }
    if (typeof q.prompt !== "string" || q.prompt.length === 0) {
      throw new Error(
        `QuizRunnerFlow: question.prompt must be a non-empty string (id=${q.id}).`
      );
    }
    if (!Array.isArray(q.options) || q.options.length < 2) {
      throw new Error(
        `QuizRunnerFlow: question.options must have at least 2 options (id=${q.id}).`
      );
    }
    if (typeof q.correctOptionId !== "string" || q.correctOptionId.length === 0) {
      throw new Error(
        `QuizRunnerFlow: question.correctOptionId must be a non-empty string (id=${q.id}).`
      );
    }

    const optionIds = q.options.map((o) => o?.id);
    const unique = new Set(optionIds);
    if (unique.size !== optionIds.length) {
      throw new Error(
        `QuizRunnerFlow: option ids must be unique within a question (id=${q.id}).`
      );
    }
    const hasCorrect = q.options.some((o) => o.id === q.correctOptionId);
    if (!hasCorrect) {
      throw new Error(
        `QuizRunnerFlow: correctOptionId must match an option id (id=${q.id}).`
      );
    }
  }
}

function createInitialState(questionCount) {
  return {
    step: "IN_PROGRESS", // "IN_PROGRESS" | "COMPLETED"
    index: 0,
    score: 0,
    selectedOptionId: null,
    hasSubmitted: false,
  };
}

function reducer(state, action) {
  switch (action.type) {
    case "SELECT_OPTION": {
      if (state.step !== "IN_PROGRESS") return state;
      if (state.hasSubmitted) return state; // lock selection after submit
      return { ...state, selectedOptionId: action.optionId };
    }

    case "SUBMIT": {
      if (state.step !== "IN_PROGRESS") return state;
      if (state.hasSubmitted) return state;
      if (!state.selectedOptionId) return state;

      const isCorrect = action.selectedOptionId === action.correctOptionId;
      return {
        ...state,
        hasSubmitted: true,
        score: isCorrect ? state.score + 1 : state.score,
      };
    }

    case "NEXT": {
      if (state.step !== "IN_PROGRESS") return state;
      if (!state.hasSubmitted) return state; // enforce submit-first invariant

      const nextIndex = state.index + 1;
      const isDone = nextIndex >= action.questionCount;

      if (isDone) {
        return { ...state, step: "COMPLETED" };
      }

      return {
        ...state,
        index: nextIndex,
        selectedOptionId: null,
        hasSubmitted: false,
      };
    }

    case "RESTART": {
      return createInitialState(action.questionCount);
    }

    default:
      return state;
  }
}

function computeAnswerFeedback({ hasSubmitted, selectedOptionId, correctOptionId }) {
  if (!hasSubmitted) return null;
  if (!selectedOptionId) return null;
  return selectedOptionId === correctOptionId ? "correct" : "incorrect";
}

// PUBLIC_INTERFACE
export default function QuizRunner() {
  /** Minimal quiz runner page: static questions, scoring, next, and results summary. */
  const questionBank = useMemo(() => STATIC_QUESTION_BANK, []);

  // Validate once; if invalid, fail fast (developer feedback).
  useMemo(() => {
    assertValidQuestionBank(questionBank);
    return null;
  }, [questionBank]);

  const [state, dispatch] = useReducer(
    reducer,
    questionBank,
    (qb) => createInitialState(qb.length)
  );

  const total = questionBank.length;
  const current = questionBank[Math.min(state.index, total - 1)];
  const progressLabel =
    state.step === "COMPLETED"
      ? "Completed"
      : `Question ${state.index + 1} of ${total}`;

  const feedback = current
    ? computeAnswerFeedback({
        hasSubmitted: state.hasSubmitted,
        selectedOptionId: state.selectedOptionId,
        correctOptionId: current.correctOptionId,
      })
    : null;

  const canSubmit = state.step === "IN_PROGRESS" && !!state.selectedOptionId && !state.hasSubmitted;
  const canNext = state.step === "IN_PROGRESS" && state.hasSubmitted;

  return (
    <section className="page" aria-label="Quiz Runner">
      <div className="quizHeader">
        <div>
          <h1 className="pageTitle">Quick Quiz</h1>
          <p className="pageBody">
            A minimal static quiz runner with scoring and a results summary.
          </p>
        </div>

        <div className="quizMeta" aria-label="Quiz status">
          <div className="quizPill">
            <span className="quizPillLabel">Progress</span>
            <span className="quizPillValue">{progressLabel}</span>
          </div>
          <div className="quizPill">
            <span className="quizPillLabel">Score</span>
            <span className="quizPillValue">
              {state.score} / {total}
            </span>
          </div>
        </div>
      </div>

      {state.step === "COMPLETED" ? (
        <div className="quizCard" role="region" aria-label="Quiz results">
          <h2 className="quizTitle">Results</h2>
          <p className="quizBody">
            You scored <strong>{state.score}</strong> out of <strong>{total}</strong>.
          </p>

          <div className="quizActions">
            <button
              type="button"
              className="quizButton quizButtonPrimary"
              onClick={() => dispatch({ type: "RESTART", questionCount: total })}
            >
              Restart quiz
            </button>
          </div>
        </div>
      ) : (
        <div className="quizCard" role="region" aria-label="Question">
          <div className="quizQuestionHeader">
            <h2 className="quizTitle">{current.prompt}</h2>
            {state.hasSubmitted ? (
              <span
                className={`quizBadge ${
                  feedback === "correct" ? "quizBadgeCorrect" : "quizBadgeIncorrect"
                }`}
              >
                {feedback === "correct" ? "Correct" : "Incorrect"}
              </span>
            ) : (
              <span className="quizBadge quizBadgeNeutral">Choose an answer</span>
            )}
          </div>

          <div className="quizOptions" role="radiogroup" aria-label="Answer options">
            {current.options.map((opt) => {
              const isSelected = state.selectedOptionId === opt.id;
              const isCorrect = opt.id === current.correctOptionId;
              const isWrongSelected =
                state.hasSubmitted && isSelected && !isCorrect;

              const showCorrect =
                state.hasSubmitted && isCorrect;

              const optionClass = [
                "quizOption",
                isSelected ? "quizOptionSelected" : "",
                showCorrect ? "quizOptionCorrect" : "",
                isWrongSelected ? "quizOptionIncorrect" : "",
              ]
                .filter(Boolean)
                .join(" ");

              return (
                <button
                  key={opt.id}
                  type="button"
                  className={optionClass}
                  role="radio"
                  aria-checked={isSelected}
                  disabled={state.hasSubmitted}
                  onClick={() =>
                    dispatch({ type: "SELECT_OPTION", optionId: opt.id })
                  }
                >
                  <span className="quizOptionDot" aria-hidden="true" />
                  <span className="quizOptionText">{opt.text}</span>
                </button>
              );
            })}
          </div>

          <div className="quizActions">
            <button
              type="button"
              className="quizButton"
              onClick={() => dispatch({ type: "RESTART", questionCount: total })}
            >
              Restart
            </button>

            {!state.hasSubmitted ? (
              <button
                type="button"
                className="quizButton quizButtonPrimary"
                disabled={!canSubmit}
                onClick={() =>
                  dispatch({
                    type: "SUBMIT",
                    selectedOptionId: state.selectedOptionId,
                    correctOptionId: current.correctOptionId,
                  })
                }
              >
                Submit
              </button>
            ) : (
              <button
                type="button"
                className="quizButton quizButtonPrimary"
                disabled={!canNext}
                onClick={() =>
                  dispatch({ type: "NEXT", questionCount: total })
                }
              >
                {state.index + 1 >= total ? "View results" : "Next"}
              </button>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
