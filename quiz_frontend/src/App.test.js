import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";

test("renders QuizMaster brand", () => {
  render(<App />);
  const brand = screen.getByText(/QuizMaster/i);
  expect(brand).toBeInTheDocument();
});

test("results page can render attempt details empty state", async () => {
  // Ensure deterministic Results page behavior for this test.
  window.localStorage.removeItem("quizmaster.results.v1");

  // App already includes <BrowserRouter>. In tests, do NOT wrap <App/> in another router
  // (e.g. MemoryRouter), or React Router will throw nested-router errors.
  //
  // Instead, control the initial route via the History API before rendering.
  window.history.pushState({}, "Results", "/results");

  render(<App />);

  // Wait for Results route to render (Layout and AuthProvider effects may schedule updates).
  expect(await screen.findByRole("heading", { name: "Results" })).toBeInTheDocument();

  // "Attempt details" is the title shown when no attempt is selected.
  expect(await screen.findByText("Attempt details")).toBeInTheDocument();

  // Stable empty-state assertion (subtitle + alert content).
  expect(await screen.findByText(/Select an attempt to review answers\./i)).toBeInTheDocument();
  expect(await screen.findByText(/Choose an attempt from the list to see which answers were wrong\./i)).toBeInTheDocument();

  // Optional: confirm nav link exists and works without flaking.
  const user = userEvent.setup();
  await user.click(screen.getByRole("link", { name: "Quizzes" }));
  expect(await screen.findByText("Categories")).toBeInTheDocument();
});
