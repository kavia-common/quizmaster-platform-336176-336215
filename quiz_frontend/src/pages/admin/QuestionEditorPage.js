import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import { adminCreateQuestion, adminListQuestions, adminUpdateQuestion } from "../../api/quizApi";
import { Alert, Card, Field } from "../../components/Ui";

function parseJsonSafe(text) {
  try {
    return { ok: true, value: JSON.parse(text) };
  } catch (e) {
    return { ok: false, error: e?.message || "Invalid JSON" };
  }
}

// PUBLIC_INTERFACE
export default function QuestionEditorPage() {
  /** Admin screen to create or edit a question (CRUD). */
  const { id } = useParams();
  const isNew = id === "new" || id === undefined;
  const { token } = useAuth();
  const navigate = useNavigate();

  const [loadState, setLoadState] = useState({ status: isNew ? "ready" : "loading", error: null, loaded: null });
  const [busy, setBusy] = useState(false);
  const [apiError, setApiError] = useState(null);

  const [quizId, setQuizId] = useState("");
  const [prompt, setPrompt] = useState("");
  const [optionsJson, setOptionsJson] = useState('[{"id":"a","text":"Option A"},{"id":"b","text":"Option B"}]');
  const [correctAnswerId, setCorrectAnswerId] = useState("a");

  useEffect(() => {
    let cancelled = false;

    (async () => {
      if (isNew) return;

      setLoadState({ status: "loading", error: null, loaded: null });
      const res = await adminListQuestions(token);
      if (cancelled) return;

      if (!res.ok) {
        setLoadState({ status: "error", error: res.error, loaded: null });
        return;
      }

      const rows = Array.isArray(res.data) ? res.data : (res.data?.items || res.data?.questions || []);
      const row = rows.find(r => String(r.id) === String(id));
      if (!row) {
        setLoadState({ status: "error", error: { message: "Question not found." }, loaded: null });
        return;
      }

      setQuizId(String(row.quizId || row.quiz_id || ""));
      setPrompt(String(row.text || row.prompt || ""));
      const opts = row.answers || row.options || [];
      setOptionsJson(JSON.stringify(opts, null, 2));
      setCorrectAnswerId(String(row.correctAnswerId || row.correct_answer_id || row.correctAnswer || ""));
      setLoadState({ status: "ready", error: null, loaded: row });
    })();

    return () => { cancelled = true; };
  }, [id, isNew, token]);

  const optionsParse = useMemo(() => parseJsonSafe(optionsJson), [optionsJson]);

  const onSave = async (e) => {
    e.preventDefault();
    setApiError(null);

    if (!quizId || !prompt) {
      setApiError({ message: "Quiz ID and prompt are required." });
      return;
    }
    if (!optionsParse.ok || !Array.isArray(optionsParse.value)) {
      setApiError({ message: `Options must be valid JSON array. ${optionsParse.ok ? "" : optionsParse.error}` });
      return;
    }

    const payload = {
      quizId,
      text: prompt,
      answers: optionsParse.value,
      correctAnswerId
    };

    setBusy(true);
    const res = isNew
      ? await adminCreateQuestion(token, payload)
      : await adminUpdateQuestion(token, id, payload);
    setBusy(false);

    if (!res.ok) {
      setApiError(res.error);
      return;
    }

    navigate("/admin", { replace: true });
  };

  return (
    <div className="container narrow">
      <div className="pageHeader">
        <div>
          <h1 className="h1">{isNew ? "New question" : "Edit question"}</h1>
          <p className="muted">Keep JSON options stable; update only here if backend schema differs.</p>
        </div>
        <div className="pageHeaderActions">
          <Link className="btn btnSecondary" to="/admin">Back</Link>
        </div>
      </div>

      {loadState.status === "error" ? (
        <Alert kind="error" title="Failed to load question">
          <pre className="codeBlock">{JSON.stringify(loadState.error, null, 2)}</pre>
        </Alert>
      ) : null}

      {apiError ? (
        <Alert kind="error" title="Save failed">
          <pre className="codeBlock">{JSON.stringify(apiError, null, 2)}</pre>
        </Alert>
      ) : null}

      <Card title="Question details">
        <form className="form" onSubmit={onSave}>
          <Field label="Quiz ID">
            <input className="input" value={quizId} onChange={(e) => setQuizId(e.target.value)} placeholder="e.g. 1" />
          </Field>
          <Field label="Prompt">
            <textarea className="input textarea" value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Question prompt…" />
          </Field>
          <Field label="Options (JSON array)" error={!optionsParse.ok ? optionsParse.error : ""} hint='Example: [{"id":"a","text":"…"}]'>
            <textarea className="input textarea code" value={optionsJson} onChange={(e) => setOptionsJson(e.target.value)} />
          </Field>
          <Field label="Correct Answer ID" hint="Must match an option id/value.">
            <input className="input" value={correctAnswerId} onChange={(e) => setCorrectAnswerId(e.target.value)} placeholder="e.g. a" />
          </Field>

          <button className="btn btnBlock" disabled={busy || loadState.status !== "ready"} type="submit">
            {busy ? "Saving…" : "Save"}
          </button>
        </form>
      </Card>
    </div>
  );
}
