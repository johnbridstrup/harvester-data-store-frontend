import { render, screen } from "@/test-utils";
import VersionReportDetailView from "@/pages/harvdeploy/versiondetail";

test("should render the version report detail view", async () => {
  const routeObject = [
    {
      path: "/harvversion/:versionId",
      element: <VersionReportDetailView />,
    },
  ];
  const routeHistory = ["/harvversion/1"];
  const initialRouteIndex = 0;

  render(<VersionReportDetailView />, {
    routeObject,
    routeHistory,
    initialRouteIndex,
  });

  const header = await screen.findByText(/HDS Harvester Version Report 1/);
  expect(header).toBeInTheDocument();

  expect(screen.getByText("1")).toBeInTheDocument();
  expect(screen.getByText("False")).toBeInTheDocument();
  expect(screen.getByText("011")).toBeInTheDocument();
});
