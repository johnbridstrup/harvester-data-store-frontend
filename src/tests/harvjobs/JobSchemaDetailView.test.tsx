import { render, screen } from "@/test-utils";
import JobSchemaDetailView from "@/pages/harvjob/jobschemas/detailview";

test("should render job schema detail view", async () => {
  const routeObject = [
    {
      path: "/jobschemas/:jobschemaId",
      element: <JobSchemaDetailView />,
    },
  ];
  const routeHistory = ["/jobschemas/1"];
  const initialRouteIndex = 0;

  render(<JobSchemaDetailView />, {
    routeObject,
    routeHistory,
    initialRouteIndex,
  });

  const heading = await screen.findByText(/HDS Job Schemas 1/);
  expect(heading).toBeInTheDocument();

  const backLink = screen.getByRole("link", { name: /Back/i });
  expect(backLink).toBeInTheDocument();

  const container = screen.getByTestId("job-schema");
  expect(container).toBeInTheDocument();
});
