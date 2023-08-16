import { render, screen, getByText, getAllByText } from "@/test-utils";
import { vi } from "vitest";
import AutodiagnosticDetailView from "@/pages/autodiagnostic/detailview";

// mock the react-plotly.js library, which fails to run server side
// TypeError: window.URL.createObjectURL is not a function

// Best practices on testing react app follow link
// https://blog.sapegin.me/all/react-testing-1-best-practices/

vi.mock("react-plotly.js", () => ({
  __esModule: true,
  default: vi.fn(() => <div>React Plotly Component</div>),
}));

test("should render the autodiagnostics detail view", async () => {
  const routeObject = [
    {
      path: "/autodiagnostics/:reportId",
      element: <AutodiagnosticDetailView />,
    },
  ];
  const routeHistory = ["/autodiagnostics/1"];
  const initialRouteIndex = 0;

  render(<AutodiagnosticDetailView />, {
    routeObject,
    routeHistory,
    initialRouteIndex,
  });

  const header = await screen.findByText(/Autodiagnostics: Harv 11 Robot 1/);
  expect(header).toBeInTheDocument();

  const table = screen.getByRole("table");
  expect(table).toBeInTheDocument();

  const rows = screen.getAllByRole("row");
  expect(rows.length).toBe(2);
  const lastRow = rows[1];
  expect(getByText(lastRow, "success")).toBeInTheDocument();
  expect(getAllByText(lastRow, "True").length).toBe(2);
  expect(getAllByText(lastRow, "0").length).toBe(2);
  expect(getByText(lastRow, "-97.90048509561304")).toBeInTheDocument();
  expect(getByText(lastRow, "1.8017578125")).toBeInTheDocument();
  expect(getByText(lastRow, "1.845703125")).toBeInTheDocument();
  expect(getByText(lastRow, "3.2841796875")).toBeInTheDocument();
  expect(getByText(lastRow, "19.9345703125")).toBeInTheDocument();
  expect(getByText(lastRow, "9")).toBeInTheDocument();
});
