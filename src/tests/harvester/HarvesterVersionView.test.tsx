import { getByText, render, screen } from "@/test-utils";
import HarvesterVersionView from "@/pages/harvester/harvesterversion";

test("should render the harvester version view", async () => {
  let routeObject = [
    {
      path: "/harvesters/:harvId/versions",
      element: <HarvesterVersionView />,
    },
  ];
  let routeHistory = ["/harvesters/1/versions"];
  let initialRouteIndex = 0;

  render(<HarvesterVersionView />, {
    routeHistory,
    initialRouteIndex,
    routeObject,
  });

  const heading = await screen.findByText(/HDS Harvester Version 11/);
  expect(heading).toBeInTheDocument();

  const table = await screen.findByRole("table");
  expect(table).toBeInTheDocument();
  const row = screen.getAllByRole("row");
  expect(row.length).toBe(2);
  const lastRow = row[1];
  expect(getByText(lastRow, "1")).toBeInTheDocument();
});
