import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import Categories from "./pages/Categories";
import Admin from "./pages/Admin";

/**
 * App routing flow contract:
 * - Inputs: browser location (provided by react-router)
 * - Outputs: renders the corresponding page inside a shared AppShell layout
 * - Errors: none expected; unknown routes redirect to "/"
 * - Side effects: none
 */
// PUBLIC_INTERFACE
function App() {
  /** Root application component. Provides layout + routes. */
  return (
    <div className="appShell">
      <Header />

      <main className="main">
        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/admin" element={<Admin />} />

            {/* Canonical behavior for unknown routes */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </main>

      <footer className="footer">
        <span className="footerText">
          © {new Date().getFullYear()} Quizmaster Platform
        </span>
      </footer>
    </div>
  );
}

export default App;
