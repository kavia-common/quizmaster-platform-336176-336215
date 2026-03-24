import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { listCategories, listQuizzesByCategory } from "../api/quizApi";
import { Alert, Card } from "../components/Ui";

function normalizeList(payload) {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.items)) return payload.items;
  if (Array.isArray(payload.categories)) return payload.categories;
  if (Array.isArray(payload.quizzes)) return payload.quizzes;
  return [];
}

// PUBLIC_INTERFACE
export default function HomePage() {
  /** Landing page for browsing categories and selecting a quiz to take. */
  const [categoriesState, setCategoriesState] = useState({ status: "loading", data: [], error: null });
  const [activeCategoryId, setActiveCategoryId] = useState("");
  const [quizzesState, setQuizzesState] = useState({ status: "idle", data: [], error: null });

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setCategoriesState({ status: "loading", data: [], error: null });
      const res = await listCategories();
      if (cancelled) return;

      if (!res.ok) {
        setCategoriesState({ status: "error", data: [], error: res.error });
        return;
      }
      const cats = normalizeList(res.data);
      setCategoriesState({ status: "ready", data: cats, error: null });
      if (cats[0]?.id) setActiveCategoryId(String(cats[0].id));
    })();

    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      if (!activeCategoryId) return;
      setQuizzesState({ status: "loading", data: [], error: null });
      const res = await listQuizzesByCategory(activeCategoryId);
      if (cancelled) return;

      if (!res.ok) {
        setQuizzesState({ status: "error", data: [], error: res.error });
        return;
      }
      setQuizzesState({ status: "ready", data: normalizeList(res.data), error: null });
    })();

    return () => { cancelled = true; };
  }, [activeCategoryId]);

  const categories = categoriesState.data || [];
  const quizzes = quizzesState.data || [];

  const activeCategory = useMemo(
    () => categories.find(c => String(c.id) === String(activeCategoryId)),
    [categories, activeCategoryId]
  );

  return (
    <div className="container">
      <div className="grid2">
        <Card
          title="Categories"
          subtitle="Pick a topic and choose a quiz."
        >
          {categoriesState.status === "error" ? (
            <Alert kind="error" title="Failed to load categories">
              <pre className="codeBlock">{JSON.stringify(categoriesState.error, null, 2)}</pre>
            </Alert>
          ) : null}

          <div className="list">
            {categories.map(cat => (
              <button
                key={cat.id}
                className={String(cat.id) === String(activeCategoryId) ? "listItem active" : "listItem"}
                onClick={() => setActiveCategoryId(String(cat.id))}
              >
                <div className="listTitle">{cat.name || cat.title || `Category ${cat.id}`}</div>
                <div className="listMeta">{cat.description || " "}</div>
              </button>
            ))}
            {categoriesState.status === "loading" ? <div className="muted">Loading…</div> : null}
          </div>
        </Card>

        <Card
          title={activeCategory?.name || "Quizzes"}
          subtitle="Start when you’re ready. Your latest result will appear in Results."
        >
          {quizzesState.status === "error" ? (
            <Alert kind="error" title="Failed to load quizzes">
              <pre className="codeBlock">{JSON.stringify(quizzesState.error, null, 2)}</pre>
            </Alert>
          ) : null}

          <div className="cards">
            {quizzes.map(q => (
              <div className="miniCard" key={q.id}>
                <div className="miniCardTitle">{q.title || q.name || `Quiz ${q.id}`}</div>
                <div className="miniCardMeta">{q.description || "Multiple choice quiz"}</div>
                <div className="miniCardActions">
                  <Link className="btn btnSmall" to={`/quiz/${q.id}`}>Start</Link>
                </div>
              </div>
            ))}
            {quizzesState.status === "loading" ? <div className="muted">Loading…</div> : null}
            {quizzesState.status === "ready" && quizzes.length === 0 ? (
              <Alert kind="info" title="No quizzes found">
                This category doesn’t have quizzes yet.
              </Alert>
            ) : null}
          </div>
        </Card>
      </div>
    </div>
  );
}
