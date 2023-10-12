import { Link, useNavigate } from "react-router-dom";
import { useAppSelector } from "@/app/hooks";
import { darkThemeClass } from "@/utils/utils";
import { ScheduledJob } from "@/features/jobscheduler/jobschedulerTypes";
import { SJPagination } from "@/components/pagination";
import "./styles.css";

function MyJob() {
  const { scheduledjobs } = useAppSelector((state) => state.jobscheduler);
  const { theme } = useAppSelector((state) => state.home);
  const tabledt = darkThemeClass("dt-table", theme);
  const rowdt = darkThemeClass("dt-row", theme);
  const navigate = useNavigate();

  const modifyAndReschedule = (job: ScheduledJob) => {
    navigate(
      `/schedulejob/?job=${job.id}&jobtype=${job.job_def.jobtype}&schema_version=${job.job_def.schema_version}`,
    );
  };

  return (
    <div>
      <div className="myjobs mt-4">My Jobs</div>
      <div className="table-responsive">
        <table className={`table ${tabledt}`}>
          <thead>
            <tr>
              <th>Schedule Status</th>
              <th>Job Status</th>
              <th>Job Type</th>
              <th>Targets</th>
              <th>Modify and Reschedule</th>
            </tr>
          </thead>
          <tbody>
            {scheduledjobs?.map((job, _) => (
              <tr key={job.id} className={`tr-hover ${rowdt}`}>
                <td>
                  <Link to={`/scheduledjobs/${job.id}`}>
                    {job.schedule_status}
                  </Link>
                </td>
                <td>
                  <Link to={`/jobs/${job.jobs[job.jobs.length - 1]?.id}`}>
                    {job.jobs[job.jobs.length - 1]?.jobstatus}
                  </Link>
                </td>
                <td>{job.job_def.jobtype}</td>
                <td>{job.targets.map((x) => x.harv_id).join(", ")}</td>
                <td>
                  <span className="cursor">
                    <i
                      onClick={() => modifyAndReschedule(job)}
                      className="las la-pencil-alt"
                    ></i>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <SJPagination />
    </div>
  );
}

export default MyJob;
