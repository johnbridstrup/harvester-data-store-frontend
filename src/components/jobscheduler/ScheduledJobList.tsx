import { Link } from "react-router-dom";
import { useAppSelector } from "@/app/hooks";
import { LoaderDiv } from "@/components/styled";
import { darkThemeClass } from "@/utils/utils";
import { Loader } from "../common";

function ScheduledJobList() {
  const { scheduledjobs, loading } = useAppSelector(
    (state) => state.jobscheduler,
  );
  const { theme } = useAppSelector((state) => state.home);
  const tabledt = darkThemeClass("dt-table", theme);

  return (
    <>
      {loading ? (
        <LoaderDiv>
          <Loader size={50} />
        </LoaderDiv>
      ) : (
        <div className="table-responsive">
          <table className={`table ${tabledt}`}>
            <thead>
              <tr>
                <td>ID</td>
                <td>Schedule Status</td>
                <td>Job Type</td>
                <td>Schema Version</td>
              </tr>
            </thead>
            <tbody>
              {scheduledjobs.map((job, _) => (
                <tr key={job.id}>
                  <td>
                    <Link to={`/scheduledjobs/${job.id}`}>{job.id}</Link>
                  </td>
                  <td>{job.schedule_status}</td>
                  <td>{job.job_def.jobtype}</td>
                  <td>{job.job_def.schema_version}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

export default ScheduledJobList;
