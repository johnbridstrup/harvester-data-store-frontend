import { Link } from "react-router-dom";
import { ScheduledJob } from "@/features/jobscheduler/jobschedulerTypes";
import { darkThemeClass } from "@/utils/utils";

interface JobProps {
  jobs: Array<ScheduledJob>;
  theme: string;
}

function JobsTable(props: JobProps) {
  const tabledt = darkThemeClass("dt-table", props.theme);
  return (
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
          {props.jobs.map((job, _) => (
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
  );
}

export default JobsTable;
