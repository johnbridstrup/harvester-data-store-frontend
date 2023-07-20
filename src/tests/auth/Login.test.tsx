import { render, screen } from "@/test-utils";
import userEvent from "@testing-library/user-event";
import Login from "@/pages/auth/login";

test("should render login page", async () => {
  const user = userEvent.setup();
  const routeObject = [
    {
      path: "/login",
      element: <Login />,
    },
  ];
  const routeHistory = ["/login"];
  const initialRouteIndex = 0;

  render(<Login />, {
    routeObject,
    routeHistory,
    initialRouteIndex,
  });

  const username = screen.getByLabelText("Username");
  const password = screen.getByLabelText("Password");
  const submit = screen.getByRole("button", { name: "Login" });

  expect(submit).toBeInTheDocument();
  expect(username).toBeInTheDocument();
  expect(password).toBeInTheDocument();

  const form = screen.getByTestId("login-form");
  expect(form).toHaveFormValues({
    username: "",
    password: "",
  });

  await user.type(username, "aft");
  await user.type(password, "aft-pass");

  expect(form).toHaveFormValues({
    username: "aft",
    password: "aft-pass",
  });
});
