import {
  render,
  screen,
  getAllByRole,
  getByText,
  getAllByText,
} from "@/test-utils";
import { vi } from "vitest";
import userEvent from "@testing-library/user-event";
import selectEvent from "react-select-event";
import ErrorReportListView from "@/pages/errorreport/errorlist";

vi.mock("react-slick", () => ({
  __esModule: true,
  default: vi.fn(() => <div>React Slick Component</div>),
}));

test("should render the error report list view", async () => {
  const user = userEvent.setup();
  const routeObject = [
    {
      path: "/errorreports",
      element: <ErrorReportListView />,
    },
  ];
  const routeHistory = ["/errorreports"];
  const initialRouteIndex = 0;

  render(<ErrorReportListView />, {
    routeObject,
    routeHistory,
    initialRouteIndex,
  });

  const banner = screen.getByText(/HDS Error Reports/);
  expect(banner).toBeInTheDocument();

  const form = screen.getByTestId("query-form");
  expect(form).toHaveFormValues({
    fruit: "",
    harv_ids: "",
    locations: "",
    code: "",
    traceback: "",
    generic: "",
    tz: "",
    start_time: "",
    end_time: "",
    primary: false,
  });

  const combobox = screen.getAllByRole("combobox");
  expect(combobox).toHaveLength(5);

  const harvIdSelect = screen.getByLabelText("Harv IDS");
  const ranchSelect = screen.getByLabelText("Ranches");
  const fruitSelect = screen.getByLabelText("Fruit");
  const codeSelect = screen.getByLabelText("Code");
  const tzSelect = screen.getByLabelText("Timezone");
  const traceback = screen.getByLabelText("Traceback");
  const genericLook = screen.getByLabelText("Generic LookUp");
  const startTime = screen.getByLabelText("Start Time");
  const endTime = screen.getByLabelText("End Time");
  const primaryOnly = screen.getByLabelText("Primary Only");

  await user.click(harvIdSelect);
  await user.click(ranchSelect);
  await user.click(fruitSelect);
  await user.click(codeSelect);
  await user.click(tzSelect);
  await user.click(primaryOnly);

  await selectEvent.select(harvIdSelect, ["11"]);
  await selectEvent.select(ranchSelect, ["Ranch A"]);
  await selectEvent.select(fruitSelect, ["apple"]);
  await selectEvent.select(codeSelect, ["0: AFTBaseException"]);
  await user.type(traceback, "traceback");
  await user.type(genericLook, "column__x=y");
  await selectEvent.select(tzSelect, []);
  await user.type(startTime, "20230322174630");
  await user.type(endTime, "20230322174631");

  expect(primaryOnly).toBeChecked();

  expect(form).toHaveFormValues({
    fruit: "apple",
    harv_ids: "11",
    locations: "Ranch A",
    code: "0",
    traceback: "traceback",
    generic: "column__x=y",
    tz: "",
    start_time: "20230322174630",
    end_time: "20230322174631",
    primary: true,
  });

  const table = screen.getByRole("table");
  expect(table).toBeInTheDocument();

  let row = getAllByRole(table, "row");
  expect(row.length).toBe(2);
  let lastRow = row[1];
  expect(getByText(lastRow, "6")).toBeInTheDocument();
  // disabled due to timezone issue
  // expect(getByText(lastRow, "20220920T065652.933")).toBeInTheDocument();
  expect(getByText(lastRow, "11")).toBeInTheDocument();
  expect(getByText(lastRow, "Ranch B")).toBeInTheDocument();
  expect(getByText(lastRow, "0*, 0")).toBeInTheDocument();
  expect(getByText(lastRow, "drivesys.0*, harvester.0")).toBeInTheDocument();
  expect(getAllByText(lastRow, "unknown")).toHaveLength(2);
});
