import { render, screen, getByText } from "@/test-utils";
import userEvent from "@testing-library/user-event";
import LocationListView from "@/pages/location/listview";

test("should render the location list view", async () => {
  const user = userEvent.setup();
  const routeObject = [
    {
      path: "/locations",
      element: <LocationListView />,
    },
  ];
  const routeHistory = ["/locations"];
  const initialRouteIndex = 0;

  render(<LocationListView />, {
    routeObject,
    routeHistory,
    initialRouteIndex,
  });

  const heading = screen.getByText(/HDS Locations/);
  expect(heading).toBeInTheDocument();

  const addbtn = screen.getByRole("button", { name: /add new location/i });
  expect(addbtn).toBeInTheDocument();

  const modal = screen.getByTestId("addUpdateModal");
  expect(modal).toBeInTheDocument();
  expect(modal).toHaveStyle({
    display: "none",
  });

  await user.click(addbtn);

  const locform = screen.getByTestId("loc-form");
  expect(locform).toBeInTheDocument();

  const ranch = screen.getByLabelText("Ranch");
  const country = screen.getByLabelText("Country");
  const region = screen.getByLabelText("Region");
  const channel = screen.getByLabelText("Site Channel");

  await user.type(ranch, "Ranch A");
  await user.type(country, "United States");
  await user.type(region, "California");
  await user.type(channel, "harvs-dev");

  expect(locform).toHaveFormValues({
    ranch: "Ranch A",
    country: "United States",
    region: "California",
    siteChannel: "harvs-dev",
  });

  const table = await screen.findByRole("table");
  expect(table).toBeInTheDocument();

  const row = screen.getAllByRole("row");
  expect(row.length).toBe(2);
  const lastRow = row[1];
  expect(getByText(lastRow, "1")).toBeInTheDocument();
  expect(getByText(lastRow, "Distributor 1")).toBeInTheDocument();
  expect(getByText(lastRow, "Ranch A")).toBeInTheDocument();
  expect(getByText(lastRow, "United States")).toBeInTheDocument();
  expect(getByText(lastRow, "California")).toBeInTheDocument();
  expect(getByText(lastRow, "harvs-dev")).toBeInTheDocument();
});
