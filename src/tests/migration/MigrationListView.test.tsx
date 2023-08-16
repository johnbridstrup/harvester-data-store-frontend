import { getByText, render, screen } from "@/test-utils";
import userEvent from "@testing-library/user-event";
import MigrationListView from "@/pages/migration/listview";

test("should render migrationlog list view", async () => {
  const user = userEvent.setup();
  let routeObject = [
    {
      path: "/migrations",
      element: <MigrationListView />,
    },
  ];
  let routeHistory = ["/migrations"];
  const initialRouteIndex = 0;

  render(<MigrationListView />, {
    routeObject,
    routeHistory,
    initialRouteIndex,
  });

  const heading = screen.getByText(/HDS Migration Log/);
  expect(heading).toBeInTheDocument();

  const queueBtn = screen.getByRole("button", { name: "Queue Migrations" });
  expect(queueBtn).toBeInTheDocument();

  const queueModal = screen.getByTestId("confirmModal");
  expect(queueModal).toBeInTheDocument();
  expect(queueModal).toHaveStyle({
    display: "none",
  });

  await user.click(queueBtn);

  const table = await screen.findByRole("table");
  expect(table).toBeInTheDocument();

  const row = await screen.findAllByRole("row");
  expect(row.length).toBe(2);
  const lastRow = row[1];
  expect(getByText(lastRow, "1")).toBeInTheDocument();
  expect(getByText(lastRow, "success")).toBeInTheDocument();
  expect(getByText(lastRow, "UNKNOWN")).toBeInTheDocument();

  const link = await screen.findByRole("link", { name: "success" });
  expect(link).toBeInTheDocument();
});
