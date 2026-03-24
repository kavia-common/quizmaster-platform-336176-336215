import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import App from "./App";

test("renders QuizMaster brand", () => {
  render(<App />);
  const brand = screen.getByText(/QuizMaster/i);
  expect(brand).toBeInTheDocument();
});

test("results page can render attempt details empty state", async () => {
  // Ensure deterministic Results page behavior for this test.
  window.localStorage.removeItem("quizmaster.results.v1");

  // Use MemoryRouter so the test controls the initial URL and navigation is reliable.
  // This also reduces act() warnings caused by async router updates.
  render(
    <MemoryRouter initialEntries={["/"]}>
      <App />
    </MemoryRouter>
  );

  const user = userEvent.setup();

  // Click the header nav link and await the route transition.
  await user.click(screen.getByRole("link", { name: "Results" }));

  // Results page header should render immediately after navigation.
  expect(await screen.findByRole("heading", { name: "Results" })).toBeInTheDocument();

  // Empty state (no active attempt selected / no results).
  expect(await screen.findByText("Attempt details")).toBeInTheDocument();
  expect(screen.getByText(/Select an attempt to review answers\./i)).toBeInTheDocument();
});
