import { render, screen, getByText } from "@/test-utils";
import userEvent from "@testing-library/user-event";
import LogSessionListView from "@/pages/logparser/logsession/listview";

test("should render the logsession list view", async () => {
  const user = userEvent.setup();
  const routeObject = [
    {
      path: "/logsessions",
      element: <LogSessionListView />,
    },
  ];
  const routeHistory = ["/logsessions"];
  const initialRouteIndex = 0;

  render(<LogSessionListView />, {
    routeObject,
    routeHistory,
    initialRouteIndex,
  });

  const heading = screen.getByText(/LOG PARSER/);
  expect(heading).toBeInTheDocument();

  const dropZone = await screen.findByText(/Drag & Drop your files here/i);
  expect(dropZone).toBeInTheDocument();

  const button = screen.queryByRole("button", { name: "Upload" });
  expect(button).not.toBeInTheDocument();

  const fakeFile = new File(["hello"], "hello.zip", {
    type: "application/zip",
  });

  const inputFile = await screen.findByTestId(/fileDropZone/i);
  expect(inputFile).toBeInTheDocument();

  await user.upload(inputFile, fakeFile);

  const table = await screen.findByRole("table");
  expect(table).toBeInTheDocument();

  const row = await screen.findAllByRole("row");
  expect(row.length).toBe(2);
  const lastRow = row[1];
  expect(getByText(lastRow, "1")).toBeInTheDocument();
  expect(
    getByText(
      lastRow,
      "sessclip_h5r2_202202081050.zip-3cc32b36-dad7-47ab-8b6a-749adeacaf79",
    ),
  ).toBeInTheDocument();

  const link = await screen.findByRole("link", { name: "View Logs" });
  expect(link).toBeInTheDocument();
});
