import { render, screen, getByText } from "@/test-utils";
import userEvent from "@testing-library/user-event";
import selectEvent from "react-select-event";
import JobListView from "@/pages/harvjob/jobs/listview";

test("should render the jobs list view", async () => {
  const user = userEvent.setup();
  const routeObject = [
    {
      path: "/jobs",
      element: <JobListView />,
    },
  ];
  const routeHistory = ["/jobs"];
  const initialRouteIndex = 0;

  render(<JobListView />, {
    routeObject,
    routeHistory,
    initialRouteIndex,
  });

  const heading = screen.getByText(/HDS Jobs/);
  expect(heading).toBeInTheDocument();

  const form = screen.getByTestId("query-form");
  expect(form).toHaveFormValues({
    uuid: "",
    harv_id: "",
    jobstatus: "",
  });

  const combobox = screen.getAllByRole("combobox");
  expect(combobox).toHaveLength(2);

  const harvIdSelect = screen.getByLabelText("Harv ID");
  const statusSelect = screen.getByLabelText("Job Status");
  const uuid = screen.getByLabelText("UUID");

  await user.click(harvIdSelect);
  await user.click(statusSelect);
  await selectEvent.select(harvIdSelect, ["11"]);
  await selectEvent.select(statusSelect, ["Success"]);
  await user.type(uuid, "fake-uuid");

  expect(form).toHaveFormValues({
    uuid: "fake-uuid",
    harv_id: "11",
    jobstatus: "Success",
  });

  const table = await screen.findByRole("table");
  expect(table).toBeInTheDocument();

  const rows = await screen.findAllByRole("row");
  expect(rows.length).toBe(2);
  const lastRow = rows[1];
  expect(getByText(lastRow, "test")).toBeInTheDocument();
  expect(getByText(lastRow, "1.0")).toBeInTheDocument();
  expect(getByText(lastRow, "Success")).toBeInTheDocument();
});
