import React from "react";

// PUBLIC_INTERFACE
export default function Home() {
  /** Minimal Home page component for the Quizmaster frontend. */
  const apiBase =
    process.env.REACT_APP_API_BASE ||
    process.env.REACT_APP_BACKEND_URL ||
    "(not configured)";

  return (
    <div className="appShell">
      <header className="topBar">
        <div className="brand">
          <div className="logoMark" aria-hidden="true" />
          <span className="brandName">Quizmaster</span>
        </div>

        <nav className="nav" aria-label="Primary">
          <a className="navLink" href="#categories">
            Categories
          </a>
          <a className="navLink" href="#admin">
            Admin
          </a>
        </nav>
      </header>

      <main className="main">
        <section className="hero" aria-label="Welcome">
          <h1 className="title">Welcome to Quizmaster</h1>
          <p className="subtitle">
            A clean, minimal quiz experience. Choose a category, answer multiple
            choice questions, and see your results instantly.
          </p>

          <div className="cardRow">
            <div className="card">
              <h2 className="cardTitle">Browse categories</h2>
              <p className="cardBody">
                Discover quizzes by topic and jump right in.
              </p>
            </div>

            <div className="card">
              <h2 className="cardTitle">Track your score</h2>
              <p className="cardBody">
                Get immediate feedback and a results summary.
              </p>
            </div>

            <div className="card">
              <h2 className="cardTitle">Admin tools</h2>
              <p className="cardBody">
                Manage questions and keep your content fresh.
              </p>
            </div>
          </div>

          <div className="meta">
            <span className="metaLabel">API base:</span>{" "}
            <code className="metaCode">{apiBase}</code>
          </div>
        </section>
      </main>

      <footer className="footer">
        <span className="footerText">
          © {new Date().getFullYear()} Quizmaster Platform
        </span>
      </footer>
    </div>
  );
}
