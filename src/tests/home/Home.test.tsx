import { render, screen } from "@/test-utils";
import userEvent from "@testing-library/user-event";
import Home from "@/pages/home";

test("should render the home page", async () => {
  const user = userEvent.setup();
  const routeObject = [
    {
      path: "/",
      element: <Home />,
    },
  ];
  const routeHistory = ["/"];
  const initialRouteIndex = 0;

  render(<Home />, { routeObject, routeHistory, initialRouteIndex });

  const welcome = screen.getByText(/Welcome to HDS/);
  expect(welcome).toBeInTheDocument();

  const searchHarv = screen.getByRole("spinbutton");
  expect(searchHarv).toBeInTheDocument();

  await user.clear(searchHarv);
  await user.type(searchHarv, "100");

  expect(searchHarv).toHaveValue(100);
});
