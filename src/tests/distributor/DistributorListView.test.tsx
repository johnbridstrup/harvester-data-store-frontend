import { render, screen, getByText } from "@/test-utils";
import userEvent from "@testing-library/user-event";
import DistributorListView from "@/pages/distributor/listview";

test("should render the distributor list view", async () => {
  const user = userEvent.setup();
  const routeObject = [
    {
      path: "/distributors",
      element: <DistributorListView />,
    },
  ];
  const routeHistory = ["/distributors"];
  const initialRouteIndex = 0;

  render(<DistributorListView />, {
    routeObject,
    routeHistory,
    initialRouteIndex,
  });

  const heading = screen.getByText(/HDS Distributors/);
  expect(heading).toBeInTheDocument();

  const addbtn = screen.getByRole("button", { name: /add new distributor/i });
  expect(addbtn).toBeInTheDocument();
  await user.click(addbtn);

  const distform = screen.getByTestId("dist-form");
  expect(distform).toBeInTheDocument();

  const name = screen.getByLabelText("Name");
  await user.type(name, "Distributor 1");
  expect(distform).toHaveFormValues({
    name: "Distributor 1",
  });

  const table = await screen.findByRole("table");
  expect(table).toBeInTheDocument();

  const row = screen.getAllByRole("row");
  expect(row.length).toBe(2);
  const lastRow = row[1];
  expect(getByText(lastRow, "1")).toBeInTheDocument();
  expect(getByText(lastRow, "Distributor 1")).toBeInTheDocument();
});
