import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Alert, Card } from "../components/Ui";

const LS_RESULTS = "quizmaster.results.v1";

function loadResults() {
  try {
    const raw = localStorage.getItem(LS_RESULTS);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function formatPct(score, total) {
  const denom = Math.max(1, Number(total));
  return Math.round((Number(score) / denom) * 100);
}

// PUBLIC_INTERFACE
export default function ResultsPage() {
  /** Shows locally stored recent quiz results (and per-question review when available). */
  const [results, setResults] = useState(() => loadResults());
  const [activeId, setActiveId] = useState(() => (results[0]?.id ? String(results[0].id) : ""));

  const summary = useMemo(() => {
    if (!results.length) return { attempts: 0, avg: 0 };
    const avg = results.reduce((acc, r) => acc + (Number(r.score) / Math.max(1, Number(r.total))), 0) / results.length;
    return { attempts: results.length, avg: Math.round(avg * 100) };
  }, [results]);

  const active = useMemo(
    () => results.find(r => String(r.id) === String(activeId)) || null,
    [results, activeId]
  );

  const wrongCount = useMemo(() => {
    const answers = active?.answers;
    if (!Array.isArray(answers)) return null;
    return answers.filter(a => a.wasCorrect === false).length;
  }, [active]);

  const clear = () => {
    localStorage.removeItem(LS_RESULTS);
    setResults([]);
    setActiveId("");
  };

  return (
    <div className="container">
      <div className="pageHeader">
        <div>
          <h1 className="h1">Results</h1>
          <p className="muted">Your latest quiz attempts (stored in this browser).</p>
        </div>
        <div className="pageHeaderActions">
          <Link className="btn btnSecondary" to="/">Browse quizzes</Link>
          <button className="btn btnDanger" onClick={clear} disabled={!results.length}>Clear</button>
        </div>
      </div>

      <div className="grid2">
        <Card title="Summary" subtitle="Quick overview">
          <div className="statRow">
            <div className="stat">
              <div className="statLabel">Attempts</div>
              <div className="statValue">{summary.attempts}</div>
            </div>
            <div className="stat">
              <div className="statLabel">Average score</div>
              <div className="statValue">{summary.avg}%</div>
            </div>
          </div>
        </Card>

        <Card title="Recent attempts" subtitle="Up to 20 items">
          {!results.length ? (
            <Alert kind="info" title="No results yet">
              Take a quiz to see your results here.
            </Alert>
          ) : (
            <div className="table" role="list">
              <div className="tableRow tableHead" role="listitem">
                <div>Quiz</div>
                <div>Score</div>
                <div>Taken</div>
              </div>

              {results.map(r => {
                const isActive = String(r.id) === String(activeId);
                return (
                  <button
                    key={r.id}
                    type="button"
                    className={isActive ? "tableRow resultRow active" : "tableRow resultRow"}
                    onClick={() => setActiveId(String(r.id))}
                    style={{ cursor: "pointer", textAlign: "left" }}
                    aria-label={`View details for ${r.title || `Quiz ${r.quizId}`}`}
                  >
                    <div className="truncate">{r.title || `Quiz ${r.quizId}`}</div>
                    <div><strong>{r.score}</strong> / {r.total} <span className="muted">({formatPct(r.score, r.total)}%)</span></div>
                    <div className="muted">{new Date(r.takenAt).toLocaleString()}</div>
                  </button>
                );
              })}
            </div>
          )}
        </Card>
      </div>

      <div style={{ height: 14 }} />

      <Card
        title={active ? (active.title || `Quiz ${active.quizId}`) : "Attempt details"}
        subtitle={
          active
            ? `Score: ${active.score} / ${active.total}${wrongCount !== null ? ` • Wrong: ${wrongCount}` : ""}`
            : "Select an attempt to review answers."
        }
        actions={active ? <Link className="btn btnSmall btnSecondary" to={`/quiz/${active.quizId}`}>Retake</Link> : null}
      >
        {!active ? (
          <Alert kind="info" title="No attempt selected">
            Choose an attempt from the list to see which answers were wrong.
          </Alert>
        ) : !Array.isArray(active.answers) ? (
          <Alert kind="warning" title="Details not available for this attempt">
            This attempt was recorded before answer-review was enabled. Take a new quiz attempt to see wrong answers and the correct answers here.
          </Alert>
        ) : (
          <div className="reviewList">
            {active.answers.map((a, idx) => {
              const wrong = a.wasCorrect === false;
              return (
                <div
                  key={`${a.questionId}-${idx}`}
                  className={wrong ? "reviewItem wrong" : "reviewItem correct"}
                >
                  <div className="reviewQ">
                    <span className="reviewNum">Q{idx + 1}.</span> {a.questionText || "(question)"}
                  </div>

                  <div className="reviewA">
                    <div className="reviewLabel">Your answer</div>
                    <div className={wrong ? "reviewValue wrong" : "reviewValue correct"}>
                      {a.selectedAnswerText || a.selectedAnswerId || "(no answer)"}
                    </div>
                  </div>

                  {wrong ? (
                    <div className="reviewA">
                      <div className="reviewLabel">Correct answer</div>
                      <div className="reviewValue correct">
                        {a.correctAnswerText || a.correctAnswerId || "(unknown)"}
                      </div>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}
