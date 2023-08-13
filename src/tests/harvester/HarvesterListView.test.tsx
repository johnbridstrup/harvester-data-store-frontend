import { render, screen, getByText } from "@/test-utils";
import userEvent from "@testing-library/user-event";
import selectEvent from "react-select-event";
import HarvesterListView from "@/pages/harvester/harvesterlist";

test("should render the harvester list view", async () => {
  const user = userEvent.setup();
  const routeObject = [
    {
      path: "/harvesters",
      element: <HarvesterListView />,
    },
  ];
  const routeHistory = ["/harvesters"];
  const initialRouteIndex = 0;

  render(<HarvesterListView />, {
    routeObject,
    routeHistory,
    initialRouteIndex,
  });

  const heading = screen.getByText(/HDS Harvesters/);
  expect(heading).toBeInTheDocument();

  const addbtn = screen.getByRole("button", { name: /add new harvester/i });
  expect(addbtn).toBeInTheDocument();
  await user.click(addbtn);

  const harvform = screen.getByTestId("harv-form");
  expect(harvform).toBeInTheDocument();

  const name = screen.getByLabelText("Name");
  const harvId = screen.getByLabelText("Harv ID");
  const fruitSelect = screen.getByLabelText("Fruit");
  const locationSelect = screen.getByLabelText("Location");
  await user.type(name, "aftharv01");
  await user.type(harvId, "001");

  await user.click(fruitSelect);
  await user.click(locationSelect);

  await selectEvent.select(fruitSelect, ["apple"]);
  await selectEvent.select(locationSelect, ["Ranch A"]);

  expect(harvform).toHaveFormValues({
    name: "aftharv01",
    harv_id: "001",
    fruit: "2",
    location: "1",
  });

  const table = await screen.findByRole("table");
  expect(table).toBeInTheDocument();

  const row = screen.getAllByRole("row");
  expect(row.length).toBe(2);
  const lastRow = row[1];
  expect(getByText(lastRow, "1")).toBeInTheDocument();
  expect(getByText(lastRow, "11")).toBeInTheDocument();
  expect(getByText(lastRow, "apple")).toBeInTheDocument();
  expect(getByText(lastRow, "Ranch B")).toBeInTheDocument();
  expect(getByText(lastRow, "False")).toBeInTheDocument();
});
