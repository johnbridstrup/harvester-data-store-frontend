import { render, screen, getByText } from "@/test-utils";
import userEvent from "@testing-library/user-event";
import selectEvent from "react-select-event";
import HarvesterSwInfoListView from "@/pages/harvesterswinfo/listview";

test("should render the harvesterswinfo list view", async () => {
  const user = userEvent.setup();
  const routeObject = [
    {
      path: "/harvesterswinfo",
      element: <HarvesterSwInfoListView />,
    },
  ];
  const routeHistory = ["/harvesterswinfo"];
  const initialRouteIndex = 0;

  render(<HarvesterSwInfoListView />, {
    routeObject,
    routeHistory,
    initialRouteIndex,
  });

  const heading = screen.getByText(/Software Deployed Version Tracking/);
  expect(heading).toBeInTheDocument();

  const queryform = screen.getByTestId("query-form");
  expect(queryform).toBeInTheDocument();

  const harvIdSelect = screen.getByLabelText("Harvesters");
  const startTime = screen.getByLabelText("Start Time");
  const endTime = screen.getByLabelText("End Time");

  await user.type(startTime, "20240607230000");
  await user.type(endTime, "20240627230000");

  await user.click(harvIdSelect);

  await selectEvent.select(harvIdSelect, ["11"]);

  expect(queryform).toHaveFormValues({
    start_time: "20240607230000",
    end_time: "20240627230000",
    harv_ids: "11",
  });

  const table = await screen.findByRole("table");
  expect(table).toBeInTheDocument();

  const row = screen.getAllByRole("row");
  expect(row.length).toBe(2);
  const lastRow = row[1];
  expect(getByText(lastRow, "09878676637388")).toBeInTheDocument();
  expect(getByText(lastRow, "false")).toBeInTheDocument();
  expect(getByText(lastRow, "software_deployed_tracking")).toBeInTheDocument();
  expect(getByText(lastRow, "aft")).toBeInTheDocument();
  expect(getByText(lastRow, "11")).toBeInTheDocument();
});
