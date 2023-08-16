import { getByText, render, screen } from "@/test-utils";
import MigrationDetailView from "@/pages/migration/detailview";

test("should render migrationlog detail view", async () => {
  let routeObject = [
    {
      path: "/migrations/:migrationId",
      element: <MigrationDetailView />,
    },
  ];
  let routeHistory = ["/migrations/1"];
  const initialRouteIndex = 0;

  render(<MigrationDetailView />, {
    routeObject,
    routeHistory,
    initialRouteIndex,
  });

  const heading = await screen.findByText(/HDS Migration Log 1/);
  expect(heading).toBeInTheDocument();

  const detailComponent = screen.getByTestId("detailComponent");
  expect(detailComponent).toBeInTheDocument();
  expect(getByText(detailComponent, "1")).toBeInTheDocument();
  expect(getByText(detailComponent, "success")).toBeInTheDocument();
  expect(getByText(detailComponent, "UNKNOWN")).toBeInTheDocument();
});
