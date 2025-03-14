import { lazy, Suspense } from "react";
import Forbidden from "@/pages/403";
import NotFound from "@/pages/404";
import InternalServerError from "@/pages/500";
import { Routes, Route } from "react-router-dom";
import { IsAdminOnly, RequireUser, UserAuth } from "@/utils/guards";
import { RouteLoader } from "@/components/styled";
import { Loader } from "@/components/common";
const Login = lazy(() => import("@/pages/auth/login"));
const Home = lazy(() => import("@/pages/home"));
const NotificationListView = lazy(
  () => import("@/pages/notification/listview"),
);
const NotificationDetailView = lazy(
  () => import("@/pages/notification/detailview"),
);
const S3FileListView = lazy(() => import("@/pages/s3files/listview"));
const S3FileDetailView = lazy(() => import("@/pages/s3files/detailview"));
const DistributorListView = lazy(() => import("@/pages/distributor/listview"));
const LocationListView = lazy(() => import("@/pages/location/listview"));
const ErrorReportListView = lazy(() => import("@/pages/errorreport/errorlist"));
const ErrorReportDetailView = lazy(
  () => import("@/pages/errorreport/errordetail"),
);
const ErrorReportParetoView = lazy(
  () => import("@/pages/errorreport/errorpareto"),
);
const UserListView = lazy(() => import("@/pages/users/listview"));
const EventListView = lazy(() => import("@/pages/event/eventlist"));
const EventDetailView = lazy(() => import("@/pages/event/eventdetail"));
const PickSessionListView = lazy(() => import("@/pages/event/picksessionlist"));
const PickSessionDetailView = lazy(
  () => import("@/pages/event/picksessiondetail"),
);
const HarvesterListView = lazy(() => import("@/pages/harvester/harvesterlist"));
const HarvesterDetailView = lazy(
  () => import("@/pages/harvester/harvesterdetail"),
);
const HarvesterVersionView = lazy(
  () => import("@/pages/harvester/harvesterversion"),
);
const HarvesterHistoryListView = lazy(
  () => import("@/pages/harvester/historylist"),
);
const HarvesterHistoryDetailView = lazy(
  () => import("@/pages/harvester/historydetail"),
);
const MigrationListView = lazy(() => import("@/pages/migration/listview"));
const MigrationDetailView = lazy(() => import("@/pages/migration/detailview"));
const AutodiagnosticListView = lazy(
  () => import("@/pages/autodiagnostic/listview"),
);
const AutodiagnosticDetailView = lazy(
  () => import("@/pages/autodiagnostic/detailview"),
);
const LogSessionListView = lazy(
  () => import("@/pages/logparser/logsession/listview"),
);
const LogSessionDetailView = lazy(
  () => import("@/pages/logparser/logsession/detailview"),
);
const LogFileListView = lazy(
  () => import("@/pages/logparser/logfile/listview"),
);
const LogWindowView = lazy(
  () => import("@/pages/logparser/logfile/listview/logwindow"),
);
const DocumentationView = lazy(() => import("@/pages/docs"));
const UserProfileView = lazy(() => import("@/pages/profile"));
const JobTypeListView = lazy(() => import("@/pages/harvjob/jobtypes/listview"));
const JobTypeDetailView = lazy(
  () => import("@/pages/harvjob/jobtypes/detailview"),
);
const JobSchemaListView = lazy(
  () => import("@/pages/harvjob/jobschemas/listview"),
);
const JobSchemaDetailView = lazy(
  () => import("@/pages/harvjob/jobschemas/detailview"),
);
const JobListView = lazy(() => import("@/pages/harvjob/jobs/listview"));
const JobDetailView = lazy(() => import("@/pages/harvjob/jobs/detailview"));
const JobResultListView = lazy(
  () => import("@/pages/harvjob/jobresults/listview"),
);
const JobResultDetailView = lazy(
  () => import("@/pages/harvjob/jobresults/detailview"),
);
const JobHistoryView = lazy(() => import("@/pages/harvjob/jobhistory"));
const ScheduleJobView = lazy(() => import("@/pages/harvjob/schedulejob"));
const JobSchedulerView = lazy(() => import("@/pages/harvjob/jobscheduler"));
const ScheduledJobListView = lazy(
  () => import("@/pages/jobscheduler/listview"),
);
const ScheduledJobDetailView = lazy(
  () => import("@/pages/jobscheduler/detailview"),
);
const ReleaseCodeListView = lazy(
  () => import("@/pages/harvdeploy/releaselist"),
);
const ReleaseCodeDetailView = lazy(
  () => import("@/pages/harvdeploy/releasedetail"),
);
const VersionReportListView = lazy(
  () => import("@/pages/harvdeploy/versionlist"),
);
const VersionReportDetailView = lazy(
  () => import("@/pages/harvdeploy/versiondetail"),
);
const EmulatorstatsListView = lazy(
  () => import("@/pages/emulatorstats/listview"),
);
const EmulatorstatsDetailView = lazy(
  () => import("@/pages/emulatorstats/detailview"),
);
const EmulatorstatsChartView = lazy(
  () => import("@/pages/emulatorstats/chartview"),
);
const TracebackBreakdownView = lazy(
  () => import("@/pages/exceptions/tracebackview"),
);
const HarvesterSwInfoListView = lazy(
  () => import("@/pages/harvesterswinfo/listview"),
);

function BaseRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <RequireUser>
            <Suspense
              fallback={
                <RouteLoader>
                  <Loader size={50} />
                </RouteLoader>
              }
            >
              <Home />
            </Suspense>
          </RequireUser>
        }
      />
      <Route
        path="/login"
        element={
          <UserAuth>
            <Suspense
              fallback={
                <RouteLoader>
                  <Loader size={50} />
                </RouteLoader>
              }
            >
              <Login />
            </Suspense>
          </UserAuth>
        }
      />
      <Route
        path="/notifications"
        element={
          <RequireUser>
            <Suspense
              fallback={
                <RouteLoader>
                  <Loader size={50} />
                </RouteLoader>
              }
            >
              <NotificationListView />
            </Suspense>
          </RequireUser>
        }
      />
      <Route
        path="/notifications/:notifyId"
        element={
          <RequireUser>
            <Suspense
              fallback={
                <RouteLoader>
                  <Loader size={50} />
                </RouteLoader>
              }
            >
              <NotificationDetailView />
            </Suspense>
          </RequireUser>
        }
      />
      <Route
        path="/s3files"
        element={
          <RequireUser>
            <Suspense
              fallback={
                <RouteLoader>
                  <Loader size={50} />
                </RouteLoader>
              }
            >
              <S3FileListView />
            </Suspense>
          </RequireUser>
        }
      />
      <Route
        path="/s3files/:s3fileId"
        element={
          <RequireUser>
            <Suspense
              fallback={
                <RouteLoader>
                  <Loader size={50} />
                </RouteLoader>
              }
            >
              <S3FileDetailView />
            </Suspense>
          </RequireUser>
        }
      />
      <Route
        path="/distributors"
        element={
          <RequireUser>
            <Suspense
              fallback={
                <RouteLoader>
                  <Loader size={50} />
                </RouteLoader>
              }
            >
              <DistributorListView />
            </Suspense>
          </RequireUser>
        }
      />
      <Route
        path="/locations"
        element={
          <RequireUser>
            <Suspense
              fallback={
                <RouteLoader>
                  <Loader size={50} />
                </RouteLoader>
              }
            >
              <LocationListView />
            </Suspense>
          </RequireUser>
        }
      />
      <Route
        path="/errorreports"
        element={
          <RequireUser>
            <Suspense
              fallback={
                <RouteLoader>
                  <Loader size={50} />
                </RouteLoader>
              }
            >
              <ErrorReportListView />
            </Suspense>
          </RequireUser>
        }
      />
      <Route
        path="/errorreports/view/pareto"
        element={
          <RequireUser>
            <Suspense
              fallback={
                <RouteLoader>
                  <Loader size={50} />
                </RouteLoader>
              }
            >
              <ErrorReportParetoView />
            </Suspense>
          </RequireUser>
        }
      />
      <Route
        path="/errorreports/:reportId"
        element={
          <RequireUser>
            <Suspense
              fallback={
                <RouteLoader>
                  <Loader size={50} />
                </RouteLoader>
              }
            >
              <ErrorReportDetailView />
            </Suspense>
          </RequireUser>
        }
      />
      <Route
        path="/users"
        element={
          <RequireUser>
            <IsAdminOnly>
              <Suspense
                fallback={
                  <RouteLoader>
                    <Loader size={50} />
                  </RouteLoader>
                }
              >
                <UserListView />
              </Suspense>
            </IsAdminOnly>
          </RequireUser>
        }
      />
      <Route
        path="/events"
        element={
          <RequireUser>
            <Suspense
              fallback={
                <RouteLoader>
                  <Loader size={50} />
                </RouteLoader>
              }
            >
              <EventListView />
            </Suspense>
          </RequireUser>
        }
      />
      <Route
        path="/events/:eventId"
        element={
          <RequireUser>
            <Suspense
              fallback={
                <RouteLoader>
                  <Loader size={50} />
                </RouteLoader>
              }
            >
              <EventDetailView />
            </Suspense>
          </RequireUser>
        }
      />
      <Route
        path="/picksessions"
        element={
          <RequireUser>
            <Suspense
              fallback={
                <RouteLoader>
                  <Loader size={50} />
                </RouteLoader>
              }
            >
              <PickSessionListView />
            </Suspense>
          </RequireUser>
        }
      />
      <Route
        path="/picksessions/:picksessionId"
        element={
          <RequireUser>
            <Suspense
              fallback={
                <RouteLoader>
                  <Loader size={50} />
                </RouteLoader>
              }
            >
              <PickSessionDetailView />
            </Suspense>
          </RequireUser>
        }
      />
      <Route
        path="/harvesters"
        element={
          <RequireUser>
            <Suspense
              fallback={
                <RouteLoader>
                  <Loader size={50} />
                </RouteLoader>
              }
            >
              <HarvesterListView />
            </Suspense>
          </RequireUser>
        }
      />
      <Route
        path="/harvesters/:harvId"
        element={
          <RequireUser>
            <Suspense
              fallback={
                <RouteLoader>
                  <Loader size={50} />
                </RouteLoader>
              }
            >
              <HarvesterDetailView />
            </Suspense>
          </RequireUser>
        }
      />
      <Route
        path="/harvesters/:harvId/versions"
        element={
          <RequireUser>
            <Suspense
              fallback={
                <RouteLoader>
                  <Loader size={50} />
                </RouteLoader>
              }
            >
              <HarvesterVersionView />
            </Suspense>
          </RequireUser>
        }
      />
      <Route
        path="/harvesterhistory"
        element={
          <RequireUser>
            <Suspense
              fallback={
                <RouteLoader>
                  <Loader size={50} />
                </RouteLoader>
              }
            >
              <HarvesterHistoryListView />
            </Suspense>
          </RequireUser>
        }
      />
      <Route
        path="/harvesterhistory/:historyId"
        element={
          <RequireUser>
            <Suspense
              fallback={
                <RouteLoader>
                  <Loader size={50} />
                </RouteLoader>
              }
            >
              <HarvesterHistoryDetailView />
            </Suspense>
          </RequireUser>
        }
      />
      <Route
        path="/migrations"
        element={
          <RequireUser>
            <Suspense
              fallback={
                <RouteLoader>
                  <Loader size={50} />
                </RouteLoader>
              }
            >
              <MigrationListView />
            </Suspense>
          </RequireUser>
        }
      />
      <Route
        path="/migrations/:migrationId"
        element={
          <RequireUser>
            <Suspense
              fallback={
                <RouteLoader>
                  <Loader size={50} />
                </RouteLoader>
              }
            >
              <MigrationDetailView />
            </Suspense>
          </RequireUser>
        }
      />
      <Route
        path="/autodiagnostics"
        element={
          <RequireUser>
            <Suspense
              fallback={
                <RouteLoader>
                  <Loader size={50} />
                </RouteLoader>
              }
            >
              <AutodiagnosticListView />
            </Suspense>
          </RequireUser>
        }
      />
      <Route
        path="/autodiagnostics/:reportId"
        element={
          <RequireUser>
            <Suspense
              fallback={
                <RouteLoader>
                  <Loader size={50} />
                </RouteLoader>
              }
            >
              <AutodiagnosticDetailView />
            </Suspense>
          </RequireUser>
        }
      />
      <Route
        path="/logsession"
        element={
          <RequireUser>
            <Suspense
              fallback={
                <RouteLoader>
                  <Loader size={50} />
                </RouteLoader>
              }
            >
              <LogSessionListView />
            </Suspense>
          </RequireUser>
        }
      />
      <Route
        path="/logsession/:sessionId"
        element={
          <RequireUser>
            <Suspense
              fallback={
                <RouteLoader>
                  <Loader size={50} />
                </RouteLoader>
              }
            >
              <LogSessionDetailView />
            </Suspense>
          </RequireUser>
        }
      />
      <Route
        path="/logfiles/:sessionId"
        element={
          <RequireUser>
            <Suspense
              fallback={
                <RouteLoader>
                  <Loader size={50} />
                </RouteLoader>
              }
            >
              <LogFileListView />
            </Suspense>
          </RequireUser>
        }
      />
      <Route
        path="/logfiles/:sessionId/logs"
        element={
          <RequireUser>
            <Suspense
              fallback={
                <RouteLoader>
                  <Loader size={50} />
                </RouteLoader>
              }
            >
              <LogWindowView />
            </Suspense>
          </RequireUser>
        }
      />
      <Route
        path="/docs"
        element={
          <RequireUser>
            <Suspense
              fallback={
                <RouteLoader>
                  <Loader size={50} />
                </RouteLoader>
              }
            >
              <DocumentationView />
            </Suspense>
          </RequireUser>
        }
      />
      <Route
        path="/users/profile/me"
        element={
          <RequireUser>
            <Suspense
              fallback={
                <RouteLoader>
                  <Loader size={50} />
                </RouteLoader>
              }
            >
              <UserProfileView />
            </Suspense>
          </RequireUser>
        }
      />
      <Route
        path="/jobtypes"
        element={
          <RequireUser>
            <Suspense
              fallback={
                <RouteLoader>
                  <Loader size={50} />
                </RouteLoader>
              }
            >
              <JobTypeListView />
            </Suspense>
          </RequireUser>
        }
      />
      <Route
        path="/jobtypes/:jobtypeId"
        element={
          <RequireUser>
            <Suspense
              fallback={
                <RouteLoader>
                  <Loader size={50} />
                </RouteLoader>
              }
            >
              <JobTypeDetailView />
            </Suspense>
          </RequireUser>
        }
      />
      <Route
        path="/jobschemas"
        element={
          <RequireUser>
            <Suspense
              fallback={
                <RouteLoader>
                  <Loader size={50} />
                </RouteLoader>
              }
            >
              <JobSchemaListView />
            </Suspense>
          </RequireUser>
        }
      />
      <Route
        path="/jobschemas/:jobschemaId"
        element={
          <RequireUser>
            <Suspense
              fallback={
                <RouteLoader>
                  <Loader size={50} />
                </RouteLoader>
              }
            >
              <JobSchemaDetailView />
            </Suspense>
          </RequireUser>
        }
      />
      <Route
        path="/jobs"
        element={
          <RequireUser>
            <Suspense
              fallback={
                <RouteLoader>
                  <Loader size={50} />
                </RouteLoader>
              }
            >
              <JobListView />
            </Suspense>
          </RequireUser>
        }
      />
      <Route
        path="/jobs/:jobId"
        element={
          <RequireUser>
            <Suspense
              fallback={
                <RouteLoader>
                  <Loader size={50} />
                </RouteLoader>
              }
            >
              <JobDetailView />
            </Suspense>
          </RequireUser>
        }
      />
      <Route
        path="/jobresults"
        element={
          <RequireUser>
            <Suspense
              fallback={
                <RouteLoader>
                  <Loader size={50} />
                </RouteLoader>
              }
            >
              <JobResultListView />
            </Suspense>
          </RequireUser>
        }
      />
      <Route
        path="/jobresults/:jobresultId"
        element={
          <RequireUser>
            <Suspense
              fallback={
                <RouteLoader>
                  <Loader size={50} />
                </RouteLoader>
              }
            >
              <JobResultDetailView />
            </Suspense>
          </RequireUser>
        }
      />
      <Route
        path="/jobstatus/:jobId"
        element={
          <RequireUser>
            <Suspense
              fallback={
                <RouteLoader>
                  <Loader size={50} />
                </RouteLoader>
              }
            >
              <JobHistoryView />
            </Suspense>
          </RequireUser>
        }
      />
      <Route
        path="/schedulejob"
        element={
          <RequireUser>
            <Suspense
              fallback={
                <RouteLoader>
                  <Loader size={50} />
                </RouteLoader>
              }
            >
              <ScheduleJobView />
            </Suspense>
          </RequireUser>
        }
      />
      <Route
        path="/jobscheduler"
        element={
          <RequireUser>
            <Suspense
              fallback={
                <RouteLoader>
                  <Loader size={50} />
                </RouteLoader>
              }
            >
              <JobSchedulerView />
            </Suspense>
          </RequireUser>
        }
      />
      <Route
        path="/scheduledjobs"
        element={
          <RequireUser>
            <Suspense
              fallback={
                <RouteLoader>
                  <Loader size={50} />
                </RouteLoader>
              }
            >
              <ScheduledJobListView />
            </Suspense>
          </RequireUser>
        }
      />
      <Route
        path="/scheduledjobs/:jobId"
        element={
          <RequireUser>
            <Suspense
              fallback={
                <RouteLoader>
                  <Loader size={50} />
                </RouteLoader>
              }
            >
              <ScheduledJobDetailView />
            </Suspense>
          </RequireUser>
        }
      />
      <Route
        path="/release"
        element={
          <RequireUser>
            <Suspense
              fallback={
                <RouteLoader>
                  <Loader size={50} />
                </RouteLoader>
              }
            >
              <ReleaseCodeListView />
            </Suspense>
          </RequireUser>
        }
      />
      <Route
        path="/release/:releaseId"
        element={
          <RequireUser>
            <Suspense
              fallback={
                <RouteLoader>
                  <Loader size={50} />
                </RouteLoader>
              }
            >
              <ReleaseCodeDetailView />
            </Suspense>
          </RequireUser>
        }
      />
      <Route
        path="/harvversion"
        element={
          <RequireUser>
            <Suspense
              fallback={
                <RouteLoader>
                  <Loader size={50} />
                </RouteLoader>
              }
            >
              <VersionReportListView />
            </Suspense>
          </RequireUser>
        }
      />
      <Route
        path="/harvversion/:versionId"
        element={
          <RequireUser>
            <Suspense
              fallback={
                <RouteLoader>
                  <Loader size={50} />
                </RouteLoader>
              }
            >
              <VersionReportDetailView />
            </Suspense>
          </RequireUser>
        }
      />
      <Route
        path="/emustats"
        element={
          <RequireUser>
            <Suspense
              fallback={
                <RouteLoader>
                  <Loader size={50} />
                </RouteLoader>
              }
            >
              <EmulatorstatsListView />
            </Suspense>
          </RequireUser>
        }
      />
      <Route
        path="/emustats/:emustatsId"
        element={
          <RequireUser>
            <Suspense
              fallback={
                <RouteLoader>
                  <Loader size={50} />
                </RouteLoader>
              }
            >
              <EmulatorstatsDetailView />
            </Suspense>
          </RequireUser>
        }
      />
      <Route
        path="/emucharts"
        element={
          <RequireUser>
            <Suspense
              fallback={
                <RouteLoader>
                  <Loader size={50} />
                </RouteLoader>
              }
            >
              <EmulatorstatsChartView />
            </Suspense>
          </RequireUser>
        }
      />
      <Route
        path="/tracebackbreakdown"
        element={
          <RequireUser>
            <Suspense
              fallback={
                <RouteLoader>
                  <Loader size={50} />
                </RouteLoader>
              }
            >
              <TracebackBreakdownView />
            </Suspense>
          </RequireUser>
        }
      />
      <Route
        path="/harvesterswinfo"
        element={
          <RequireUser>
            <Suspense
              fallback={
                <RouteLoader>
                  <Loader size={50} />
                </RouteLoader>
              }
            >
              <HarvesterSwInfoListView />
            </Suspense>
          </RequireUser>
        }
      />
      <Route
        path="/forbidden"
        element={
          <RequireUser>
            <Forbidden />
          </RequireUser>
        }
      />
      <Route path="/internal" element={<InternalServerError />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default BaseRoutes;
