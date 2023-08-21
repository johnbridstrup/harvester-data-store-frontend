import VSCodeEditor from "@monaco-editor/react";
import { ScheduledJob } from "@/features/jobscheduler/jobschedulerTypes";
import { THEME_MODES } from "@/features/base/constants";
import { monacoOptions } from "@/utils/utils";
import JobsTable from "./JobsTable";

interface JobProps {
  jobs: Array<ScheduledJob>;
  jobschema: Record<string, any>;
  theme: string;
}

function JobScheduled(props: JobProps) {
  return (
    <>
      <div className="col-md-7">
        <div className="mb-3 f-w-600">Recent Scheduled Jobs</div>
        {props.jobs.length > 0 ? (
          <JobsTable jobs={props.jobs} theme={props.theme} />
        ) : (
          <div className="jobs-wrapper">
            <div>No Scheduled Jobs Found</div>
          </div>
        )}
      </div>
      <div className="col-md-5">
        <div className="mb-3 f-w-600">Schema Version</div>
        <VSCodeEditor
          height="75vh"
          language="python"
          value={JSON.stringify(props.jobschema, null, 2)}
          theme={props.theme === THEME_MODES.DARK_THEME ? "vs-dark" : "light"}
          options={{ ...monacoOptions, readOnly: true } as any}
        />
      </div>
    </>
  );
}

export default JobScheduled;
