import { render, screen } from "@/test-utils";
import S3FileDetailView from "@/pages/s3files/detailview";

test("should render the s3file detail view", async () => {
  const routeObject = [
    {
      path: "/s3files/:s3fileId",
      element: <S3FileDetailView />,
    },
  ];
  const routeHistory = ["/s3files/1"];
  const initialRouteIndex = 0;

  render(<S3FileDetailView />, {
    routeObject,
    routeHistory,
    initialRouteIndex,
  });

  const banner = screen.getByText(/HDS S3Files 1/);
  expect(banner).toBeInTheDocument();

  const fileNames = await screen.findAllByText("fake");
  const fileName = fileNames[0];

  const eventUUID = screen.getByRole("link", {
    name: "77f6a03c-24c9-11ed-bb17-f9799c718175",
  });
  const backLink = screen.getByRole("link", { name: /Back/i });
  const downloadText = screen.getByText("Download");

  expect(fileName).toBeInTheDocument();
  expect(backLink).toBeInTheDocument();
  expect(downloadText).toBeInTheDocument();
  expect(eventUUID).toBeInTheDocument();
});
