import { render, screen, getAllByRole, getByText } from "@/test-utils";
import userEvent from "@testing-library/user-event";
import selectEvent from "react-select-event";
import ReleaseCodeListView from "@/pages/harvdeploy/releaselist";

test("should render the harvester release code list view", async () => {
  const user = userEvent.setup();
  const routeObject = [
    {
      path: "/release",
      element: <ReleaseCodeListView />,
    },
  ];
  const routeHistory = ["/release"];
  const initialRouteIndex = 0;

  render(<ReleaseCodeListView />, {
    routeObject,
    routeHistory,
    initialRouteIndex,
  });

  const header = await screen.findByText(/HDS Harvester Release Codes/);
  expect(header).toBeInTheDocument();

  const form = screen.getByTestId("query-form");
  expect(form).toHaveFormValues({
    fruit: "",
    tags: "",
  });

  const fruit = screen.getByLabelText("Fruit");
  const tags = screen.getByLabelText("Tags");

  await user.click(fruit);
  await user.click(tags);
  await selectEvent.select(fruit, ["apple"]);

  expect(form).toHaveFormValues({
    fruit: "apple",
    tags: "",
  });

  const table = screen.getByRole("table");
  const rows = getAllByRole(table, "row");
  expect(rows.length).toBe(2);
  const lastRow = rows[1];
  expect(getByText(lastRow, "1")).toBeInTheDocument();
  expect(getByText(lastRow, "20220922.163848")).toBeInTheDocument();
  expect(getByText(lastRow, "strawberry")).toBeInTheDocument();
});
