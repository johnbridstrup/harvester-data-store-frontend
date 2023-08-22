import { render, screen, getByText } from "@/test-utils";
import ScheduledJobListView from "@/pages/jobscheduler/listview";

test("should render scheduledjobs list view", async () => {
  const routeObject = [
    {
      path: "/scheduledjobs",
      element: <ScheduledJobListView />,
    },
  ];
  const routeHistory = ["/scheduledjobs"];
  const initialRouteIndex = 0;

  render(<ScheduledJobListView />, {
    routeObject,
    routeHistory,
    initialRouteIndex,
  });

  const header = screen.getByText(/HDS Scheduled Job/i);
  expect(header).toBeInTheDocument();

  const table = await screen.findByRole("table");
  expect(table).toBeInTheDocument();

  const rows = await screen.findAllByRole("row");
  expect(rows.length).toBe(2);
  const lastRow = rows[1];
  expect(getByText(lastRow, "1")).toBeInTheDocument();
  expect(getByText(lastRow, "waiting to schedule")).toBeInTheDocument();
  expect(getByText(lastRow, "test")).toBeInTheDocument();
  expect(getByText(lastRow, "1.0")).toBeInTheDocument();
});
