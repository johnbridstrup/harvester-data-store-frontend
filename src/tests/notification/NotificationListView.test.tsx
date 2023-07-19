import { render, screen, getByText } from "@/test-utils";
import NotificationListView from "@/pages/notification/listview";

test("should render the notification list view", async () => {
  const routeObject = [
    {
      path: "/notifications",
      element: <NotificationListView />,
    },
  ];
  const routeHistory = ["/notifications"];
  const initialRouteIndex = 0;

  render(<NotificationListView />, {
    routeObject,
    routeHistory,
    initialRouteIndex,
  });

  const banner = screen.getByText(/HDS Notifications/);
  expect(banner).toBeInTheDocument();

  const table = await screen.findByRole("table");
  expect(table).toBeInTheDocument();

  const rows = await screen.findAllByRole("row");
  expect(rows.length).toBe(2);
  const lastRow = rows[1];
  expect(getByText(lastRow, "ErrorReport")).toBeInTheDocument();
  expect(getByText(lastRow, "aft")).toBeInTheDocument();
});
