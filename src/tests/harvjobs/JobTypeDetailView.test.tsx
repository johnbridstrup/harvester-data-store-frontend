import { render, screen } from "@/test-utils";
import JobTypeDetailView from "@/pages/harvjob/jobtypes/detailview";

test("should render job types detail view", async () => {
  const routeObject = [
    {
      path: "/jobtypes/:jobtypeId",
      element: <JobTypeDetailView />,
    },
  ];
  const routeHistory = ["/jobtypes/1"];
  const initialRouteIndex = 0;

  render(<JobTypeDetailView />, {
    routeObject,
    routeHistory,
    initialRouteIndex,
  });

  const heading = await screen.findByText(/HDS JobTypes 1/);
  expect(heading).toBeInTheDocument();

  const backLink = screen.getByRole("link", { name: /Back/i });
  expect(backLink).toBeInTheDocument();

  const container = screen.getByTestId("job-type");
  expect(container).toBeInTheDocument();
});
