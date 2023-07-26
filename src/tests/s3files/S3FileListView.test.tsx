import { render, screen, getByText, getAllByText } from "@/test-utils";
import userEvent from "@testing-library/user-event";
import S3FileListView from "@/pages/s3files/listview";

test("should render the s3file list view", async () => {
  const user = userEvent.setup();
  const routeObject = [
    {
      path: "/s3files",
      element: <S3FileListView />,
    },
  ];
  const routeHistory = ["/s3files"];
  const initialRouteIndex = 0;

  render(<S3FileListView />, {
    routeObject,
    routeHistory,
    initialRouteIndex,
  });

  const banner = screen.getByText(/HDS S3Files/);
  expect(banner).toBeInTheDocument();

  const nameInput = screen.getByRole("textbox", { name: /Name/i });
  const filetypeInput = screen.getByRole("textbox", { name: /File Type/i });
  expect(nameInput).toBeInTheDocument();
  expect(filetypeInput).toBeInTheDocument();

  await user.clear(nameInput);
  await user.clear(filetypeInput);
  await user.type(nameInput, "fake");
  await user.type(filetypeInput, "fake");

  expect(nameInput).toHaveValue("fake");
  expect(filetypeInput).toHaveValue("fake");

  const button = screen.getByRole("button", { name: "Submit" });
  expect(button).toBeInTheDocument();

  const filesTable = await screen.findByRole("table");
  expect(filesTable).toBeInTheDocument();

  const rowData = screen.getAllByRole("row");
  expect(rowData.length).toBe(2);
  const lastRow = rowData[1];
  expect(getByText(lastRow, "1")).toBeInTheDocument();
  expect(getAllByText(lastRow, "fake").length).toBe(2);
});
