/**
 * Mock/seed dataset for local-first quiz browsing and quiz-taking.
 *
 * Purpose:
 * - Provide 10 simple multiple-choice questions as initial/mock data.
 * - Allow the UI to function when backend APIs are unavailable (network/config).
 *
 * Shape:
 * - categories: [{id,name,description}]
 * - quizzes: [{id,categoryId,title,description,questions:[...]}]
 * - questions: [{id,text,answers:[{id,text}],correctAnswerId}]
 */

// PUBLIC_INTERFACE
export function getMockDataset() {
  /** Returns the full mock dataset: categories and quizzes. */
  const categories = [
    { id: "general", name: "General Knowledge", description: "A little bit of everything." },
    { id: "science", name: "Science", description: "Everyday science basics." },
    { id: "web", name: "Web", description: "Web & programming fundamentals." }
  ];

  const quizzes = [
    {
      id: "mock-quiz-1",
      categoryId: "general",
      title: "Quick Quiz (10 Questions)",
      description: "Simple multiple-choice questions (mock data).",
      questions: [
        {
          id: "q1",
          text: "What is the capital of France?",
          answers: [
            { id: "a", text: "Paris" },
            { id: "b", text: "Rome" },
            { id: "c", text: "Madrid" },
            { id: "d", text: "Berlin" }
          ],
          correctAnswerId: "a"
        },
        {
          id: "q2",
          text: "Which planet is known as the Red Planet?",
          answers: [
            { id: "a", text: "Venus" },
            { id: "b", text: "Mars" },
            { id: "c", text: "Jupiter" },
            { id: "d", text: "Mercury" }
          ],
          correctAnswerId: "b"
        },
        {
          id: "q3",
          text: "How many minutes are in one hour?",
          answers: [
            { id: "a", text: "30" },
            { id: "b", text: "45" },
            { id: "c", text: "60" },
            { id: "d", text: "90" }
          ],
          correctAnswerId: "c"
        },
        {
          id: "q4",
          text: "What is the largest ocean on Earth?",
          answers: [
            { id: "a", text: "Atlantic Ocean" },
            { id: "b", text: "Indian Ocean" },
            { id: "c", text: "Arctic Ocean" },
            { id: "d", text: "Pacific Ocean" }
          ],
          correctAnswerId: "d"
        },
        {
          id: "q5",
          text: "Which animal is known for black-and-white stripes?",
          answers: [
            { id: "a", text: "Zebra" },
            { id: "b", text: "Giraffe" },
            { id: "c", text: "Tiger" },
            { id: "d", text: "Leopard" }
          ],
          correctAnswerId: "a"
        },
        {
          id: "q6",
          text: "Which gas do plants absorb from the atmosphere?",
          answers: [
            { id: "a", text: "Oxygen" },
            { id: "b", text: "Nitrogen" },
            { id: "c", text: "Carbon dioxide" },
            { id: "d", text: "Helium" }
          ],
          correctAnswerId: "c"
        },
        {
          id: "q7",
          text: "What is 7 × 8?",
          answers: [
            { id: "a", text: "54" },
            { id: "b", text: "56" },
            { id: "c", text: "58" },
            { id: "d", text: "64" }
          ],
          correctAnswerId: "b"
        },
        {
          id: "q8",
          text: "Which language is primarily used to style web pages?",
          answers: [
            { id: "a", text: "HTML" },
            { id: "b", text: "CSS" },
            { id: "c", text: "SQL" },
            { id: "d", text: "Python" }
          ],
          correctAnswerId: "b"
        },
        {
          id: "q9",
          text: "In computing, what does 'CPU' stand for?",
          answers: [
            { id: "a", text: "Central Processing Unit" },
            { id: "b", text: "Computer Personal Unit" },
            { id: "c", text: "Central Print Utility" },
            { id: "d", text: "Control Program Unit" }
          ],
          correctAnswerId: "a"
        },
        {
          id: "q10",
          text: "Which of these is a JavaScript framework/library?",
          answers: [
            { id: "a", text: "React" },
            { id: "b", text: "Django" },
            { id: "c", text: "Laravel" },
            { id: "d", text: "Rails" }
          ],
          correctAnswerId: "a"
        }
      ]
    },
    {
      id: "mock-quiz-2",
      categoryId: "science",
      title: "Science Mini (same 10)",
      description: "A duplicate quiz entry to show multiple quizzes in mock mode.",
      // Reuse the same 10 for simplicity; frontend only needs a usable dataset.
      questions: [
        { id: "q1", text: "What is the capital of France?", answers: [{ id: "a", text: "Paris" }, { id: "b", text: "Rome" }, { id: "c", text: "Madrid" }, { id: "d", text: "Berlin" }], correctAnswerId: "a" },
        { id: "q2", text: "Which planet is known as the Red Planet?", answers: [{ id: "a", text: "Venus" }, { id: "b", text: "Mars" }, { id: "c", text: "Jupiter" }, { id: "d", text: "Mercury" }], correctAnswerId: "b" },
        { id: "q3", text: "How many minutes are in one hour?", answers: [{ id: "a", text: "30" }, { id: "b", text: "45" }, { id: "c", text: "60" }, { id: "d", text: "90" }], correctAnswerId: "c" },
        { id: "q4", text: "What is the largest ocean on Earth?", answers: [{ id: "a", text: "Atlantic Ocean" }, { id: "b", text: "Indian Ocean" }, { id: "c", text: "Arctic Ocean" }, { id: "d", text: "Pacific Ocean" }], correctAnswerId: "d" },
        { id: "q5", text: "Which animal is known for black-and-white stripes?", answers: [{ id: "a", text: "Zebra" }, { id: "b", text: "Giraffe" }, { id: "c", text: "Tiger" }, { id: "d", text: "Leopard" }], correctAnswerId: "a" },
        { id: "q6", text: "Which gas do plants absorb from the atmosphere?", answers: [{ id: "a", text: "Oxygen" }, { id: "b", text: "Nitrogen" }, { id: "c", text: "Carbon dioxide" }, { id: "d", text: "Helium" }], correctAnswerId: "c" },
        { id: "q7", text: "What is 7 × 8?", answers: [{ id: "a", text: "54" }, { id: "b", text: "56" }, { id: "c", text: "58" }, { id: "d", text: "64" }], correctAnswerId: "b" },
        { id: "q8", text: "Which language is primarily used to style web pages?", answers: [{ id: "a", text: "HTML" }, { id: "b", text: "CSS" }, { id: "c", text: "SQL" }, { id: "d", text: "Python" }], correctAnswerId: "b" },
        { id: "q9", text: "In computing, what does 'CPU' stand for?", answers: [{ id: "a", text: "Central Processing Unit" }, { id: "b", text: "Computer Personal Unit" }, { id: "c", text: "Central Print Utility" }, { id: "d", text: "Control Program Unit" }], correctAnswerId: "a" },
        { id: "q10", text: "Which of these is a JavaScript framework/library?", answers: [{ id: "a", text: "React" }, { id: "b", text: "Django" }, { id: "c", text: "Laravel" }, { id: "d", text: "Rails" }], correctAnswerId: "a" }
      ]
    }
  ];

  return { categories, quizzes };
}

// PUBLIC_INTERFACE
export function mockListCategories() {
  /** Returns categories in the same "API-like" response shape used by the app. */
  const { categories } = getMockDataset();
  return { ok: true, status: 200, data: categories, meta: { source: "mock" } };
}

// PUBLIC_INTERFACE
export function mockListQuizzesByCategory(categoryId) {
  /** Returns quizzes filtered by categoryId. */
  const { quizzes } = getMockDataset();
  const filtered = quizzes.filter(q => String(q.categoryId) === String(categoryId));
  return { ok: true, status: 200, data: filtered, meta: { source: "mock" } };
}

// PUBLIC_INTERFACE
export function mockGetQuiz(quizId) {
  /** Returns a quiz payload with embedded questions. */
  const { quizzes } = getMockDataset();
  const quiz = quizzes.find(q => String(q.id) === String(quizId));
  if (!quiz) {
    return { ok: false, status: 404, error: { code: "MOCK_NOT_FOUND", message: "Mock quiz not found." } };
  }
  return { ok: true, status: 200, data: { quiz }, meta: { source: "mock" } };
}

// PUBLIC_INTERFACE
export function mockAdminListQuestions(quizId) {
  /** Flattens all questions across quizzes into a single list (admin list fallback). */
  const { quizzes } = getMockDataset();
  const rows = quizzes.flatMap(q =>
    (q.questions || []).map(question => ({
      id: `${q.id}:${question.id}`,
      quizId: q.id,
      text: question.text,
      answers: question.answers,
      correctAnswerId: question.correctAnswerId
    }))
  );

  const filtered = quizId ? rows.filter(r => String(r.quizId) === String(quizId)) : rows;
  return { ok: true, status: 200, data: filtered, meta: { source: "mock" } };
}
