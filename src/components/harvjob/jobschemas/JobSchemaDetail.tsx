import moment from "moment";
import VSCodeEditor from "@monaco-editor/react";
import { useAppSelector } from "@/app/hooks";
import { darkThemeClass, monacoOptions } from "@/utils/utils";
import { THEME_MODES } from "@/features/base/constants";

function DetailJobSchemas() {
  const { jobschema } = useAppSelector((state) => state.harvjob);
  const { theme } = useAppSelector((state) => state.home);
  const cardtheme = darkThemeClass("dt-card-theme", theme);
  return (
    <div className="mb-4">
      <div
        className={`card card-body mb-4 ${cardtheme}`}
        data-testid="job-schema"
      >
        <div className="row">
          <div className="col-md-3 mb-2">
            <div className="f-w-600">ID</div>
            <div>{jobschema?.id}</div>
          </div>
          <div className="col-md-3 mb-2">
            <div className="f-w-600">Version</div>
            <div>{jobschema?.version}</div>
          </div>
          <div className="col-md-3 mb-2">
            <div className="f-w-600">Job Type</div>
            <div>{jobschema?.jobtype}</div>
          </div>
          <div className="col-md-3 mb-2">
            <div className="f-w-600">Comment</div>
            <div>{jobschema?.comment}</div>
          </div>
          <div className="col-md-3 mb-2">
            <div className="f-w-600">Created At</div>
            <div>{moment(jobschema?.created).format("LLLL")}</div>
          </div>
          <div className="col-md-3 mb-2">
            <div className="f-w-600">Updated At</div>
            <div>{moment(jobschema?.lastModified).format("LLLL")}</div>
          </div>
        </div>
      </div>
      <VSCodeEditor
        height="40vh"
        language="python"
        value={JSON.stringify(jobschema?.schema, null, 2)}
        theme={theme == THEME_MODES.DARK_THEME ? "vs-dark" : "light"}
        options={{ ...monacoOptions, readOnly: true } as any}
      />
    </div>
  );
}

export default DetailJobSchemas;
