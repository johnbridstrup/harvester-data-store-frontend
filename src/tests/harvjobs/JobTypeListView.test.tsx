import { render, screen, getByText } from "@/test-utils";
import JobTypeListView from "@/pages/harvjob/jobtypes/listview";

test("should render job types list view", async () => {
  const routeObject = [
    {
      path: "/jobtypes",
      element: <JobTypeListView />,
    },
  ];
  const routeHistory = ["/jobtypes"];
  const initialRouteIndex = 0;

  render(<JobTypeListView />, {
    routeObject,
    routeHistory,
    initialRouteIndex,
  });

  const heading = await screen.findByText(/HDS JobTypes/);
  expect(heading).toBeInTheDocument();

  const backLink = screen.getByRole("link", { name: /Back/i });
  expect(backLink).toBeInTheDocument();

  const table = screen.getByRole("table");
  expect(table).toBeInTheDocument();

  const rows = screen.getAllByRole("row");
  expect(rows.length).toBe(2);

  const lastRow = rows[1];
  expect(getByText(lastRow, "1")).toBeInTheDocument();
  expect(getByText(lastRow, "test")).toBeInTheDocument();
});
