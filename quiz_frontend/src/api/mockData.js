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
    },

    /*
     * Web category additions:
     * - Multiple quizzes to ensure the Home page "Web" category shows a richer list.
     * - Unique quiz IDs and question IDs to avoid collisions in results/review flows.
     */
    {
      id: "mock-web-quiz-1",
      categoryId: "web",
      title: "Web Fundamentals (HTML/CSS)",
      description: "Core concepts for building and styling web pages.",
      questions: [
        {
          id: "web1-q1",
          text: "What does HTML stand for?",
          answers: [
            { id: "a", text: "HyperText Markup Language" },
            { id: "b", text: "High Transfer Machine Language" },
            { id: "c", text: "Hyperlink and Text Management Language" },
            { id: "d", text: "Home Tool Markup Language" }
          ],
          correctAnswerId: "a"
        },
        {
          id: "web1-q2",
          text: "Which tag is used to create a hyperlink in HTML?",
          answers: [
            { id: "a", text: "<link>" },
            { id: "b", text: "<a>" },
            { id: "c", text: "<href>" },
            { id: "d", text: "<url>" }
          ],
          correctAnswerId: "b"
        },
        {
          id: "web1-q3",
          text: "Which CSS property is used to change text color?",
          answers: [
            { id: "a", text: "font-color" },
            { id: "b", text: "text-color" },
            { id: "c", text: "color" },
            { id: "d", text: "foreground" }
          ],
          correctAnswerId: "c"
        },
        {
          id: "web1-q4",
          text: "In CSS, what does the 'box model' describe?",
          answers: [
            { id: "a", text: "How images are compressed" },
            { id: "b", text: "The structure: content, padding, border, margin" },
            { id: "c", text: "How fonts are loaded" },
            { id: "d", text: "How the browser caches files" }
          ],
          correctAnswerId: "b"
        },
        {
          id: "web1-q5",
          text: "Which HTML element is best for the main heading of a page?",
          answers: [
            { id: "a", text: "<h1>" },
            { id: "b", text: "<header>" },
            { id: "c", text: "<title>" },
            { id: "d", text: "<head>" }
          ],
          correctAnswerId: "a"
        },
        {
          id: "web1-q6",
          text: "Which CSS unit is relative to the root font-size?",
          answers: [
            { id: "a", text: "px" },
            { id: "b", text: "em" },
            { id: "c", text: "rem" },
            { id: "d", text: "%" }
          ],
          correctAnswerId: "c"
        }
      ]
    },
    {
      id: "mock-web-quiz-2",
      categoryId: "web",
      title: "JavaScript Basics",
      description: "Variables, types, and common language behavior.",
      questions: [
        {
          id: "web2-q1",
          text: "Which keyword declares a block-scoped variable in JavaScript?",
          answers: [
            { id: "a", text: "var" },
            { id: "b", text: "let" },
            { id: "c", text: "define" },
            { id: "d", text: "int" }
          ],
          correctAnswerId: "b"
        },
        {
          id: "web2-q2",
          text: "What is the result of: typeof null ?",
          answers: [
            { id: "a", text: "\"null\"" },
            { id: "b", text: "\"object\"" },
            { id: "c", text: "\"undefined\"" },
            { id: "d", text: "\"number\"" }
          ],
          correctAnswerId: "b"
        },
        {
          id: "web2-q3",
          text: "Which array method creates a new array with elements that pass a test?",
          answers: [
            { id: "a", text: "map()" },
            { id: "b", text: "filter()" },
            { id: "c", text: "forEach()" },
            { id: "d", text: "reduce()" }
          ],
          correctAnswerId: "b"
        },
        {
          id: "web2-q4",
          text: "What does JSON stand for?",
          answers: [
            { id: "a", text: "Java Source Object Notation" },
            { id: "b", text: "JavaScript Object Notation" },
            { id: "c", text: "Joined Symbolic Object Network" },
            { id: "d", text: "Java Serialized Object Name" }
          ],
          correctAnswerId: "b"
        },
        {
          id: "web2-q5",
          text: "Which statement is true about '===' in JavaScript?",
          answers: [
            { id: "a", text: "It compares values after type coercion" },
            { id: "b", text: "It compares values and types (strict equality)" },
            { id: "c", text: "It compares only references for primitives" },
            { id: "d", text: "It is the same as '='" }
          ],
          correctAnswerId: "b"
        },
        {
          id: "web2-q6",
          text: "Which API is commonly used to make HTTP requests in modern browsers?",
          answers: [
            { id: "a", text: "fetch()" },
            { id: "b", text: "readFile()" },
            { id: "c", text: "http.get()" },
            { id: "d", text: "request()" }
          ],
          correctAnswerId: "a"
        }
      ]
    },
    {
      id: "mock-web-quiz-3",
      categoryId: "web",
      title: "HTTP & Web Security Basics",
      description: "Requests, status codes, and common security concepts.",
      questions: [
        {
          id: "web3-q1",
          text: "Which HTTP method is typically used to retrieve data without side effects?",
          answers: [
            { id: "a", text: "POST" },
            { id: "b", text: "PUT" },
            { id: "c", text: "GET" },
            { id: "d", text: "PATCH" }
          ],
          correctAnswerId: "c"
        },
        {
          id: "web3-q2",
          text: "What does HTTP status code 404 mean?",
          answers: [
            { id: "a", text: "Unauthorized" },
            { id: "b", text: "Not Found" },
            { id: "c", text: "Bad Request" },
            { id: "d", text: "Server Error" }
          ],
          correctAnswerId: "b"
        },
        {
          id: "web3-q3",
          text: "What is the purpose of HTTPS?",
          answers: [
            { id: "a", text: "To compress web pages" },
            { id: "b", text: "To encrypt traffic between client and server" },
            { id: "c", text: "To speed up DNS lookups" },
            { id: "d", text: "To block all third-party cookies" }
          ],
          correctAnswerId: "b"
        },
        {
          id: "web3-q4",
          text: "Which header is commonly used to send a bearer token?",
          answers: [
            { id: "a", text: "Authorization" },
            { id: "b", text: "Set-Cookie" },
            { id: "c", text: "X-Powered-By" },
            { id: "d", text: "Accept" }
          ],
          correctAnswerId: "a"
        },
        {
          id: "web3-q5",
          text: "What is XSS (Cross-Site Scripting)?",
          answers: [
            { id: "a", text: "A database backup strategy" },
            { id: "b", text: "A vulnerability where attacker injects script into pages viewed by users" },
            { id: "c", text: "A way to speed up SSL handshakes" },
            { id: "d", text: "A protocol for streaming video" }
          ],
          correctAnswerId: "b"
        },
        {
          id: "web3-q6",
          text: "Which cookie attribute helps reduce CSRF risk for cross-site requests?",
          answers: [
            { id: "a", text: "SameSite" },
            { id: "b", text: "Expires" },
            { id: "c", text: "Path" },
            { id: "d", text: "Domain" }
          ],
          correctAnswerId: "a"
        }
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
