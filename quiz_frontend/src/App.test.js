import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders QuizMaster brand", () => {
  render(<App />);
  const brand = screen.getByText(/QuizMaster/i);
  expect(brand).toBeInTheDocument();
});

test("results page can render attempt details empty state", () => {
  // Ensure deterministic Results page behavior for this test.
  window.localStorage.removeItem("quizmaster.results.v1");

  render(<App />);

  // Navigate by clicking the header nav (avoids needing to mock router internals).
  const resultsLink = screen.getAllByText("Results")[0];
  resultsLink.click();

  expect(screen.getByText("Attempt details")).toBeInTheDocument();
  expect(screen.getByText(/Select an attempt to review answers/i)).toBeInTheDocument();
});
