import { render, screen } from "@testing-library/react";
import App from "./App";

test("should render App.tsx component", () => {
  render(<App />);
  const display = screen.getByText(/HDS Frontend/);
  expect(display).toBeInTheDocument();
});
