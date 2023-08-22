import { render, screen, getByText } from "@/test-utils";
import JobSchemaListView from "@/pages/harvjob/jobschemas/listview";

test("should render job schemas list view", async () => {
  const routeObject = [
    {
      path: "/jobschemas",
      element: <JobSchemaListView />,
    },
  ];
  const routeHistory = ["/jobschemas"];
  const initialRouteIndex = 0;

  render(<JobSchemaListView />, {
    routeObject,
    routeHistory,
    initialRouteIndex,
  });

  const heading = await screen.findByText(/HDS Job Schemas/);
  expect(heading).toBeInTheDocument();

  const backLink = screen.getByRole("link", { name: /Back/i });
  expect(backLink).toBeInTheDocument();

  const table = screen.getByRole("table");
  expect(table).toBeInTheDocument();

  const rows = screen.getAllByRole("row");
  expect(rows.length).toBe(2);

  const lastRow = rows[1];
  expect(getByText(lastRow, "1")).toBeInTheDocument();
  expect(getByText(lastRow, "1.0")).toBeInTheDocument();
  expect(getByText(lastRow, "Test schema")).toBeInTheDocument();
  expect(getByText(lastRow, "test")).toBeInTheDocument();
});
