import { render, screen, getAllByRole, getByText } from "@/test-utils";
import ReleaseCodeDetailView from "@/pages/harvdeploy/releasedetail";

test("should render the harvester release code detail view", async () => {
  const routeObject = [
    {
      path: "/release/:releaseId",
      element: <ReleaseCodeDetailView />,
    },
  ];
  const routeHistory = ["/release/1"];
  const initialRouteIndex = 0;

  render(<ReleaseCodeDetailView />, {
    routeObject,
    routeHistory,
    initialRouteIndex,
  });

  const header = await screen.findByText(/HDS Harvester Release Codes 1/);
  expect(header).toBeInTheDocument();

  const tables = screen.getAllByRole("table");
  expect(tables).toHaveLength(2);
  const firstTbl = tables[0];
  let rows = getAllByRole(firstTbl, "row");
  expect(rows.length).toBe(2);
  let lastRow = rows[1];
  expect(getByText(lastRow, "20220922.163848")).toBeInTheDocument();
  expect(getByText(lastRow, "strawberry")).toBeInTheDocument();

  const secondTbl = tables[1];
  rows = getAllByRole(secondTbl, "row");
  expect(rows.length).toBe(2);
  lastRow = rows[1];
  expect(getByText(lastRow, "aft-harv011")).toBeInTheDocument();
  expect(getByText(lastRow, "11")).toBeInTheDocument();
  expect(getByText(lastRow, "Ranch B")).toBeInTheDocument();
  expect(getByText(lastRow, "False")).toBeInTheDocument();
});
