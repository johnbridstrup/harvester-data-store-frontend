import { render, screen } from "@/test-utils";
import HarvesterHistoryDetailView from "@/pages/harvester/historydetail";

test("should render the harvester history detail view", async () => {
  const routeObject = [
    {
      path: "/harvesterhistory/:historyId",
      element: <HarvesterHistoryDetailView />,
    },
  ];
  const routeHistory = ["/harvesterhistory/1"];
  const initialRouteIndex = 0;

  render(<HarvesterHistoryDetailView />, {
    routeObject,
    routeHistory,
    initialRouteIndex,
  });

  const heading = await screen.findByText(/HDS Harvesters History 1/);
  expect(heading).toBeInTheDocument();

  expect(screen.getByText("1")).toBeInTheDocument();
  expect(screen.getByText("aft-harv011")).toBeInTheDocument();
  expect(screen.getByText("11")).toBeInTheDocument();
  expect(screen.getByText("apple")).toBeInTheDocument();
  expect(screen.getByText("Ranch B")).toBeInTheDocument();
  expect(screen.getByText("False")).toBeInTheDocument();
  expect(screen.getByText("created")).toBeInTheDocument();
});
