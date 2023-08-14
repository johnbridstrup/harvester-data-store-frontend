import { render, screen, getByText } from "@/test-utils";
import HarvesterHistoryListView from "@/pages/harvester/historylist";

test("should render the harvester history list view", async () => {
  const routeObject = [
    {
      path: "/harvesterhistory",
      element: <HarvesterHistoryListView />,
    },
  ];
  const routeHistory = ["/harvesterhistory"];
  const initialRouteIndex = 0;

  render(<HarvesterHistoryListView />, {
    routeObject,
    routeHistory,
    initialRouteIndex,
  });

  const heading = screen.getByText(/HDS Harvesters History/);
  expect(heading).toBeInTheDocument();

  const table = await screen.findByRole("table");
  expect(table).toBeInTheDocument();

  const row = screen.getAllByRole("row");
  expect(row.length).toBe(2);
  const lastRow = row[1];
  expect(getByText(lastRow, "1")).toBeInTheDocument();
  expect(getByText(lastRow, "aft-harv011")).toBeInTheDocument();
  expect(getByText(lastRow, "11")).toBeInTheDocument();
  expect(getByText(lastRow, "apple")).toBeInTheDocument();
  expect(getByText(lastRow, "Ranch B")).toBeInTheDocument();
  expect(getByText(lastRow, "False")).toBeInTheDocument();
  expect(getByText(lastRow, "created")).toBeInTheDocument();
});
