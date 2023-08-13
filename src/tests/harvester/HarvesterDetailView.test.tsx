import { render, screen, getAllByRole, getByText } from "@/test-utils";
import HarvesterDetailView from "@/pages/harvester/harvesterdetail";

test("should render the harvester detail view", async () => {
  let routeObject = [
    {
      path: "/harvesters/:harvId",
      element: <HarvesterDetailView />,
    },
  ];
  let routeHistory = ["/harvesters/1"];
  let initialRouteIndex = 0;

  render(<HarvesterDetailView />, {
    routeHistory,
    initialRouteIndex,
    routeObject,
  });

  const tables = await screen.findAllByRole("table");
  expect(tables.length).toBe(2);
  const firstTable = tables[0];
  let row = getAllByRole(firstTable, "row");
  let lastRowData = row[1];
  expect(row.length).toBe(2);
  expect(getByText(lastRowData, "aft-harv011")).toBeInTheDocument();
  expect(getByText(lastRowData, "11")).toBeInTheDocument();
  expect(getByText(lastRowData, "apple")).toBeInTheDocument();
  expect(getByText(lastRowData, "Ranch B")).toBeInTheDocument();
  expect(getByText(lastRowData, "False")).toBeInTheDocument();

  const alllistItem = screen.getAllByRole("listitem");
  expect(getByText(alllistItem[2], "Release")).toBeInTheDocument();
  expect(getByText(alllistItem[3], "Version")).toBeInTheDocument();
  expect(getByText(alllistItem[4], "AFTConfig")).toBeInTheDocument();
});
