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

  const hds = screen.getByText(/Harvester Data Store/);
  expect(hds).toBeInTheDocument();

  const searchHarv = screen.getByRole("spinbutton");
  expect(searchHarv).toBeInTheDocument();

  await user.clear(searchHarv);
  await user.type(searchHarv, "100");

  expect(searchHarv).toHaveValue(100);
});
