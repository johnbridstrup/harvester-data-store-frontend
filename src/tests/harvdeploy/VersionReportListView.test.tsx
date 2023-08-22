import { render, screen, getAllByRole, getByText } from "@/test-utils";
import VersionReportListView from "@/pages/harvdeploy/versionlist";

test("should render the version report list view", async () => {
  const routeObject = [
    {
      path: "/harvversion",
      element: <VersionReportListView />,
    },
  ];
  const routeHistory = ["/harvversion"];
  const initialRouteIndex = 0;

  render(<VersionReportListView />, {
    routeObject,
    routeHistory,
    initialRouteIndex,
  });

  const header = await screen.findByText(/HDS Harvester Version Report/);
  expect(header).toBeInTheDocument();

  const table = screen.getByRole("table");
  const rows = getAllByRole(table, "row");
  expect(rows.length).toBe(2);
  const lastRow = rows[1];
  expect(getByText(lastRow, "1")).toBeInTheDocument();
  expect(getByText(lastRow, "False")).toBeInTheDocument();
  expect(getByText(lastRow, "011")).toBeInTheDocument();
});
