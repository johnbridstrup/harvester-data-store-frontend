import { render, screen, getByText, getAllByRole } from "@/test-utils";
import JobDetailView from "@/pages/harvjob/jobs/detailview";

test("should render the jobs detail view", async () => {
  const routeObject = [
    {
      path: "/jobs/:jobId",
      element: <JobDetailView />,
    },
  ];
  const routeHistory = ["/jobs/1"];
  const initialRouteIndex = 0;

  render(<JobDetailView />, {
    routeObject,
    routeHistory,
    initialRouteIndex,
  });

  const heading = await screen.findByText(/HDS Jobs 1/);
  expect(heading).toBeInTheDocument();

  const backLink = screen.getByRole("link", { name: /Back/i });
  expect(backLink).toBeInTheDocument();

  const container = screen.getByTestId("job-detail");
  expect(container).toBeInTheDocument();
  expect(getByText(container, "test")).toBeInTheDocument();
  expect(getByText(container, "1.0")).toBeInTheDocument();
  expect(getByText(container, "Success")).toBeInTheDocument();

  const tables = screen.getAllByRole("table");
  expect(tables.length).toBe(2);

  const firstTbl = tables[0];
  let rows = getAllByRole(firstTbl, "row");
  expect(rows.length).toBe(2);
  let lastRow = rows[1];
  expect(getByText(lastRow, "1")).toBeInTheDocument();
  expect(getByText(lastRow, /aft-robot01/)).toBeInTheDocument();
  expect(getByText(lastRow, /master/)).toBeInTheDocument();
  expect(getByText(lastRow, "001")).toBeInTheDocument();

  const secondTbl = tables[1];
  rows = getAllByRole(secondTbl, "row");
  expect(rows.length).toBe(2);
  lastRow = rows[1];
  expect(getByText(lastRow, "Pending")).toBeInTheDocument();
});
