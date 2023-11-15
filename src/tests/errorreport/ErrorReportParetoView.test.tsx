import { render, screen } from "@/test-utils";
import { vi } from "vitest";
import userEvent from "@testing-library/user-event";
import selectEvent from "react-select-event";
import ErrorReportParetoView from "@/pages/errorreport/errorpareto";

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

test("should render the error report pareto view", async () => {
  const user = userEvent.setup();
  const routeObject = [
    {
      path: "/errorreports/view/pareto",
      element: <ErrorReportParetoView />,
    },
  ];
  const routeHistory = ["/errorreports/view/pareto"];
  const initialRouteIndex = 0;

  render(<ErrorReportParetoView />, {
    routeObject,
    routeHistory,
    initialRouteIndex,
  });

  const header = screen.getByText(/Error Pareto/);
  expect(header).toBeInTheDocument();

  const form = screen.getByTestId("query-form");
  expect(form).toHaveFormValues({
    fruit: "",
    harv_ids: "",
    locations: "",
    code: "",
    traceback: "",
    generic: "",
    is_emulator: "0",
    handled: "",
    tz: "",
    start_time: "",
    end_time: "",
    primary: false,
    aggregate_query: "",
  });

  const combobox = screen.getAllByRole("combobox");
  expect(combobox).toHaveLength(6);

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
  const groupBy = screen.getByLabelText("Group By");
  const harvesterOnly = screen.getByLabelText("Harvesters");
  const handled = screen.getByLabelText("Handled");

  await user.click(harvIdSelect);
  await user.click(ranchSelect);
  await user.click(fruitSelect);
  await user.click(codeSelect);
  await user.click(tzSelect);
  await user.click(groupBy);
  await user.click(harvesterOnly);
  await user.click(handled);
  await user.click(primaryOnly);

  await selectEvent.select(harvIdSelect, ["11"]);
  await selectEvent.select(ranchSelect, ["Ranch A"]);
  await selectEvent.select(fruitSelect, ["apple"]);
  await selectEvent.select(codeSelect, ["0: AFTBaseException"]);
  await selectEvent.select(groupBy, ["exception"]);
  await user.type(traceback, "traceback");
  await user.type(genericLook, "column__x=y");
  await selectEvent.select(tzSelect, []);
  await user.type(startTime, "20230322174630");
  await user.type(endTime, "20230322174631");

  expect(primaryOnly).toBeChecked();
  expect(harvesterOnly).toBeChecked();
  expect(handled).toBeChecked();

  expect(form).toHaveFormValues({
    fruit: "apple",
    harv_ids: "11",
    locations: "Ranch A",
    code: "0",
    traceback: "traceback",
    generic: "column__x=y",
    is_emulator: "0",
    handled: "1",
    tz: "",
    start_time: "20230322174630",
    end_time: "20230322174631",
    primary: true,
    aggregate_query: "code__name",
  });
});
