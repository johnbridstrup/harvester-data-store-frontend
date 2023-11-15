import { render, screen, getAllByRole, getByText } from "@/test-utils";
import { vi } from "vitest";
import ErrorReportDetailView from "@/pages/errorreport/errordetail";

// mock the react-plotly.js library, which fails to run server side
// TypeError: window.URL.createObjectURL is not a function

// Best practices on testing react app follow link
// https://blog.sapegin.me/all/react-testing-1-best-practices/

vi.mock("react-plotly.js", () => ({
  __esModule: true,
  default: vi.fn(() => <div>React Plotly Component</div>),
}));

vi.mock("react-slick", () => ({
  __esModule: true,
  default: vi.fn(() => <div>React Slick Component</div>),
}));

test("should render the error report detail view", async () => {
  const routeObject = [
    {
      path: "/errorreports/:reportId",
      element: <ErrorReportDetailView />,
    },
  ];
  const routeHistory = ["/errorreports/1"];
  const initialRouteIndex = 0;

  render(<ErrorReportDetailView />, {
    routeObject,
    routeHistory,
    initialRouteIndex,
  });

  const banner = screen.getByText(/HDS Error Reports 1/);
  expect(banner).toBeInTheDocument();

  const tables = await screen.findAllByRole("table");
  expect(tables.length).toBe(3);

  const firstTable = tables[0];
  let rows = getAllByRole(firstTable, "row");
  expect(rows.length).toBe(2);
  let lastRow = rows[1];
  // disabled due to timezone issue
  // expect(getByText(lastRow, "20220920T065652.933")).toBeInTheDocument();
  expect(getByText(lastRow, "11")).toBeInTheDocument();
  expect(getByText(lastRow, "Ranch B")).toBeInTheDocument();
  expect(getByText(lastRow, "0*, 0")).toBeInTheDocument();
  expect(getByText(lastRow, "drivesys.0*, harvester.0")).toBeInTheDocument();

  const secondTable = tables[1];
  rows = getAllByRole(secondTable, "row");
  expect(rows.length).toBe(2);
  expect(getByText(rows[0], "-5.3e-8")).toBeInTheDocument();
  expect(getByText(rows[1], "1663646207.2189846")).toBeInTheDocument();

  const thirdTable = tables[2];
  rows = getAllByRole(thirdTable, "row");
  expect(rows.length).toBe(9);
  expect(getByText(rows[1], "rcoop.0")).toBeInTheDocument();
  expect(
    getByText(rows[rows.length - 1], "robotpathstore.0"),
  ).toBeInTheDocument();
});
