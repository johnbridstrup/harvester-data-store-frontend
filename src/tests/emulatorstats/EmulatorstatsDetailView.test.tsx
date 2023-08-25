import { render, screen, getAllByRole, getByText } from "@/test-utils";
import EmulatorstatsDetailView from "@/pages/emulatorstats/detailview";

test("should render the emulator stats detail view", async () => {
  const routeObject = [
    {
      path: "/emustats/:emustatsId",
      element: <EmulatorstatsDetailView />,
    },
  ];
  const routeHistory = ["/emustats/1"];
  const initialRouteIndex = 0;

  render(<EmulatorstatsDetailView />, {
    routeObject,
    routeHistory,
    initialRouteIndex,
  });

  const header = await screen.findByText("HDS Emulator Statistics 1");
  expect(header).toBeInTheDocument();

  const backBtn = screen.getByRole("link", { name: "Back" });
  expect(backBtn).toBeInTheDocument();

  const table = screen.getByRole("table");
  expect(table).toBeInTheDocument();

  let rows = getAllByRole(table, "row");
  expect(rows.length).toBe(2);
  let lastRow = rows[1];
  expect(getByText(lastRow, "mar_goodfarms")).toBeInTheDocument();
  expect(getByText(lastRow, "mar")).toBeInTheDocument();
  expect(getByText(lastRow, "HEAD")).toBeInTheDocument();
  expect(getByText(lastRow, "799")).toBeInTheDocument();
  expect(getByText(lastRow, "804")).toBeInTheDocument();
  expect(getByText(lastRow, "EmuNullTag")).toBeInTheDocument();
});
