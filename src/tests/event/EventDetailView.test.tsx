import { render, screen } from "@/test-utils";
import EventDetailView from "@/pages/event/eventdetail";

test("should render the events detail view", async () => {
  let routeObject = [
    {
      path: "/events/:eventId",
      element: <EventDetailView />,
    },
  ];
  let routeHistory = ["/events/1"];
  let initialRouteIndex = 0;

  render(<EventDetailView />, {
    routeObject,
    routeHistory,
    initialRouteIndex,
  });

  const header = screen.getByText(/HDS Event 1/);
  expect(header).toBeInTheDocument();

  const eventUUID = await screen.findByText(
    "77f6a03c-24c9-11ed-bb17-f9799c718175",
  );
  const backLink = screen.getByRole("link", { name: /Back/i });

  expect(backLink).toBeInTheDocument();
  expect(eventUUID).toBeInTheDocument();
});
