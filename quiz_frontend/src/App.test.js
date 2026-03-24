import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders QuizMaster brand", () => {
  render(<App />);
  const brand = screen.getByText(/QuizMaster/i);
  expect(brand).toBeInTheDocument();
});
