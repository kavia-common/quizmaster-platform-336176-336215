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

// PUBLIC_INTERFACE
export default function ResultsPage() {
  /** Shows locally stored recent quiz results. */
  const [results, setResults] = useState(() => loadResults());

  const summary = useMemo(() => {
    if (!results.length) return { attempts: 0, avg: 0 };
    const avg = results.reduce((acc, r) => acc + (Number(r.score) / Math.max(1, Number(r.total))), 0) / results.length;
    return { attempts: results.length, avg: Math.round(avg * 100) };
  }, [results]);

  const clear = () => {
    localStorage.removeItem(LS_RESULTS);
    setResults([]);
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
            <div className="table">
              <div className="tableRow tableHead">
                <div>Quiz</div>
                <div>Score</div>
                <div>Taken</div>
              </div>
              {results.map(r => (
                <div className="tableRow" key={r.id}>
                  <div className="truncate">{r.title || `Quiz ${r.quizId}`}</div>
                  <div><strong>{r.score}</strong> / {r.total}</div>
                  <div className="muted">{new Date(r.takenAt).toLocaleString()}</div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
