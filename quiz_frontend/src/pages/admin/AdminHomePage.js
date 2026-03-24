import React, { useEffect, useState } from "react";
import { useAuth } from "../../auth/AuthContext";
import { adminDeleteQuestion, adminListQuestions } from "../../api/quizApi";
import { Alert, Card, Field } from "../../components/Ui";
import { Link } from "react-router-dom";

// PUBLIC_INTERFACE
export default function AdminHomePage() {
  /** Admin landing page for managing questions. */
  const { token } = useAuth();
  const [quizId, setQuizId] = useState("");
  const [state, setState] = useState({ status: "idle", data: [], error: null });
  const [busyId, setBusyId] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setState({ status: "loading", data: [], error: null });
      const res = await adminListQuestions(token, quizId || undefined);
      if (cancelled) return;
      if (!res.ok) {
        setState({ status: "error", data: [], error: res.error });
        return;
      }
      const rows = Array.isArray(res.data) ? res.data : (res.data?.items || res.data?.questions || []);
      setState({ status: "ready", data: rows, error: null });
    })();
    return () => { cancelled = true; };
  }, [token, quizId]);

  const onDelete = async (id) => {
    setBusyId(String(id));
    const res = await adminDeleteQuestion(token, id);
    setBusyId("");
    if (!res.ok) {
      setState(s => ({ ...s, error: res.error, status: "error" }));
      return;
    }
    setState(s => ({ ...s, data: s.data.filter(q => String(q.id) !== String(id)), status: "ready" }));
  };

  return (
    <div className="container">
      <div className="pageHeader">
        <div>
          <h1 className="h1">Admin</h1>
          <p className="muted">Manage quiz questions (create, edit, delete).</p>
        </div>
        <div className="pageHeaderActions">
          <Link className="btn" to="/admin/questions/new">New question</Link>
        </div>
      </div>

      {state.status === "error" && state.error ? (
        <Alert kind="error" title="Admin API error">
          <pre className="codeBlock">{JSON.stringify(state.error, null, 2)}</pre>
        </Alert>
      ) : null}

      <Card title="Filter" subtitle="Optional: list questions for a quiz">
        <div className="formRow">
          <Field label="Quiz ID" hint="Leave empty to list all questions (backend dependent).">
            <input className="input" value={quizId} onChange={(e) => setQuizId(e.target.value)} placeholder="e.g. 1" />
          </Field>
        </div>
      </Card>

      <Card title="Questions" subtitle={state.status === "loading" ? "Loading…" : `${state.data.length} item(s)`}>
        {state.status === "loading" ? <div className="muted">Loading…</div> : null}

        <div className="table">
          <div className="tableRow tableHead">
            <div>Prompt</div>
            <div>Quiz</div>
            <div>Actions</div>
          </div>

          {state.data.map(q => (
            <div className="tableRow" key={q.id}>
              <div className="truncate">{q.text || q.prompt || `Question ${q.id}`}</div>
              <div className="muted">{q.quizId || q.quiz_id || "-"}</div>
              <div className="rowActions">
                <Link className="btn btnSmall btnSecondary" to={`/admin/questions/${q.id}`}>Edit</Link>
                <button
                  className="btn btnSmall btnDanger"
                  onClick={() => onDelete(q.id)}
                  disabled={busyId === String(q.id)}
                >
                  {busyId === String(q.id) ? "Deleting…" : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>

        {state.status === "ready" && state.data.length === 0 ? (
          <Alert kind="info" title="No questions">
            Create your first question.
          </Alert>
        ) : null}
      </Card>
    </div>
  );
}
