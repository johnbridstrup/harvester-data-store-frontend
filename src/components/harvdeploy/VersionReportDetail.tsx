import moment from "moment";
import VSCodeEditor from "@monaco-editor/react";
import { useAppSelector } from "@/app/hooks";
import { darkThemeClass, monacoOptions, timeStampFormat } from "@/utils/utils";
import { THEME_MODES } from "@/features/base/constants";

function VersionReportDetail() {
  const { harvversion } = useAppSelector((state) => state.harvdeploy);
  const { timezone } = useAppSelector((state) => state.errorreport);
  const { theme } = useAppSelector((state) => state.home);
  const cardtheme = darkThemeClass("dt-card-theme", theme);

  return (
    <div className="mb-4">
      <div className={`card card-body mb-4 ${cardtheme}`}>
        <div className="row">
          <div className="col-md-3 mb-2">
            <div className="f-w-600">ID</div>
            <div>{harvversion?.id}</div>
          </div>
          <div className="col-md-3 mb-2">
            <div className="f-w-600">Time</div>
            <div>
              {timeStampFormat(
                new Date(harvversion?.reportTime as string),
                timezone as string,
              )}
            </div>
          </div>
          <div className="col-md-3 mb-2">
            <div className="f-w-600">Dirty</div>
            <div>{harvversion?.is_dirty ? "True" : "False"}</div>
          </div>
          <div className="col-md-3 mb-2">
            <div className="f-w-600">Harvester</div>
            <div>{harvversion?.report?.data?.serial_number}</div>
          </div>
          <div className="col-md-3 mb-2">
            <div className="f-w-600">Created At</div>
            <div>{moment(harvversion?.created).format("LLLL")}</div>
          </div>
          <div className="col-md-3 mb-2">
            <div className="f-w-600">Updated At</div>
            <div>{moment(harvversion?.lastModified).format("LLLL")}</div>
          </div>
        </div>
      </div>
      <div className="f-w-600">Report</div>
      <VSCodeEditor
        height="40vh"
        language="json"
        value={JSON.stringify(harvversion?.report, null, 2)}
        theme={theme === THEME_MODES.DARK_THEME ? "vs-dark" : "light"}
        options={{ ...monacoOptions, readOnly: true } as any}
      />
    </div>
  );
}

export default VersionReportDetail;
