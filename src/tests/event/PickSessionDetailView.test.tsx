import { render, screen } from "@/test-utils";
import PickSessionDetailView from "@/pages/event/picksessiondetail";

test("should render the pickssession detail view", async () => {
  const routeObject = [
    {
      path: "/picksessions/:pickId",
      element: <PickSessionDetailView />,
    },
  ];
  const routeHistory = ["/picksessions/1"];
  const initialRouteIndex = 0;

  render(<PickSessionDetailView />, {
    routeObject,
    routeHistory,
    initialRouteIndex,
  });

  const header = screen.getByText(/HDS PickSession/);
  expect(header).toBeInTheDocument();

  const reportText = await screen.findByText("Autodiagnostics Report");
  const eventUUID = await screen.findByText(
    "2225cd5a-765a-11ed-9d09-677a59a17003",
  );
  const backLink = screen.getByRole("link", { name: /Back/i });

  expect(reportText).toBeInTheDocument();
  expect(backLink).toBeInTheDocument();
  expect(eventUUID).toBeInTheDocument();
});
