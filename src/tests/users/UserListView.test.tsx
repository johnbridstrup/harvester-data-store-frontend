import { render, screen, getByText } from "@/test-utils";
import userEvent from "@testing-library/user-event";
import UserListView from "@/pages/users/listview";

test("should render the users list view", async () => {
  const user = userEvent.setup();
  const routeObject = [
    {
      path: "/users",
      element: <UserListView />,
    },
  ];
  const routeHistory = ["/users"];
  const initialRouteIndex = 0;

  render(<UserListView />, {
    routeObject,
    routeHistory,
    initialRouteIndex,
  });

  const banner = screen.getByText(/HDS User Management/);
  expect(banner).toBeInTheDocument();

  const addbtn = screen.getByRole("button", { name: /add new user/i });
  expect(addbtn).toBeInTheDocument();

  const modal = screen.getByTestId("addUpdateModal");
  expect(modal).toBeInTheDocument();
  expect(modal).toHaveStyle({
    display: "none",
  });

  const userform = screen.getByTestId("user-form");
  expect(userform).toBeInTheDocument();

  const fname = screen.getByLabelText("First Name");
  const lname = screen.getByLabelText("Last Name");
  const slack = screen.getByLabelText("Slack ID");
  const email = screen.getByLabelText("Email Address");
  const username = screen.getByLabelText("Username");
  const staff = screen.getByLabelText("Is Staff User");
  const password = screen.getByLabelText("Password");
  const password2 = screen.getByLabelText("Confirm Password");

  await user.type(fname, "aft");
  await user.type(lname, "aft");
  await user.type(slack, "slack@aft.aft");
  await user.type(email, "aft@aft.aft");
  await user.type(username, "aft");
  await user.click(staff);
  await user.type(password, "aftpassword");
  await user.type(password2, "aftpassword");

  expect(userform).toHaveFormValues({
    first_name: "aft",
    last_name: "aft",
    slack_id: "slack@aft.aft",
    email: "aft@aft.aft",
    username: "aft",
    is_staff: true,
    password: "aftpassword",
    password2: "aftpassword",
  });

  const table = await screen.findByRole("table");
  expect(table).toBeInTheDocument();

  const row = screen.getAllByRole("row");
  expect(row.length).toBe(2);
  const lastRow = row[1];
  expect(getByText(lastRow, "aft")).toBeInTheDocument();
  expect(getByText(lastRow, "aft@aft.aft")).toBeInTheDocument();
  expect(getByText(lastRow, "slack@aft.aft")).toBeInTheDocument();
});
