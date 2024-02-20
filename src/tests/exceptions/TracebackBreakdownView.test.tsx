import { render, screen } from "@/test-utils";
import { vi } from "vitest";
import userEvent from "@testing-library/user-event";
import selectEvent from "react-select-event";
import TracebackBreakdownView from "@/pages/exceptions/tracebackview";

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

test("should render the traceback breakdown view", async () => {
  const user = userEvent.setup();
  const routeObject = [
    {
      path: "/tracebackbreakdown",
      element: <TracebackBreakdownView />,
    },
  ];
  const routeHistory = ["/tracebackbreakdown"];
  const initialRouteIndex = 0;

  render(<TracebackBreakdownView />, {
    routeObject,
    routeHistory,
    initialRouteIndex,
  });

  const heading = screen.getByText(/Traceback Breakdown/);
  expect(heading).toBeInTheDocument();

  const form = screen.getByTestId("query-form");
  expect(form).toHaveFormValues({
    fruit: "",
    harv_ids: "",
    locations: "",
    code: "",
    traceback: "",
    generic: "",
    tz: "",
    primary: false,
  });

  const harvIdSelect = screen.getByLabelText("Harv IDS");
  const ranchSelect = screen.getByLabelText("Ranches");
  const fruitSelect = screen.getByLabelText("Fruit");
  const codeSelect = screen.getByLabelText("Code");
  const traceback = screen.getByLabelText("Traceback");
  const genericLook = screen.getByLabelText("Generic LookUp");
  const startTime = screen.getByLabelText("Start Time");
  const endTime = screen.getByLabelText("End Time");
  const tzSelect = screen.getByLabelText("Timezone");
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
  await user.clear(startTime);
  await user.clear(endTime);
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
});
