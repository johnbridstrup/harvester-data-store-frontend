import moment from "moment";
import { useState } from "react";
import VSCodeEditor from "@monaco-editor/react";
import { useAppSelector } from "@/app/hooks";
import { HostResult } from "@/features/harvjob/harvjobTypes";
import { THEME_MODES } from "@/features/base/constants";
import { darkThemeClass, monacoOptions, timeStampFormat } from "@/utils/utils";
import { Accordion } from "@/components/styled";

function DetailJobResult() {
  const [detailObj, setDetailObj] = useState<HostResult | null>(null);
  const { jobresult } = useAppSelector((state) => state.harvjob);
  const { theme } = useAppSelector((state) => state.home);
  const cardtheme = darkThemeClass("dt-card-theme", theme);

  const handleHostClick = (obj: HostResult) => {
    setDetailObj(obj);
  };

  return (
    <>
      <div className="mb-5">
        <div className={`card card-body ${cardtheme}`}>
          <div className="row">
            <div className="col-md-3 mb-2">
              <div className="f-w-600">ID</div>
              <div>{jobresult?.id}</div>
            </div>
            <div className="col-md-3 mb-2">
              <div className="f-w-600">Time</div>
              <div>
                {timeStampFormat(new Date(jobresult?.reportTime as string))}
              </div>
            </div>
            <div className="col-md-3 mb-2">
              <div className="f-w-600">HarvID</div>
              <div>{jobresult?.report?.serial_number}</div>
            </div>
            <div className="col-md-3 mb-2">
              <div className="f-w-600">Created At</div>
              <div>{moment(jobresult?.created).format("LLLL")}</div>
            </div>
            <div className="col-md-3 mb-2">
              <div className="f-w-600">Updated At</div>
              <div>{moment(jobresult?.lastModified).format("LLLL")}</div>
            </div>
          </div>
        </div>
      </div>
      <div className="mb-4">
        <div className="f-w-600 mb-3">Host Results</div>
        {jobresult?.host_results?.map((host, _) => (
          <div key={host.id}>
            <div
              className="d-flex border-bottom cursor"
              onClick={() => handleHostClick(host)}
            >
              <div className="flex-5">
                {timeStampFormat(new Date(host.timestamp))}
              </div>
              <div className="flex-5">{host.host}</div>
              <div
                className={`flex-5 ${
                  host.result === "Success"
                    ? "text-success"
                    : host.result === "Pending"
                    ? "text-warning"
                    : "text-danger"
                }`}
              >
                {host.result}
              </div>
            </div>
            <Accordion obj={detailObj} host={host}>
              {detailObj?.id === host.id && (
                <VSCodeEditor
                  height="20vh"
                  language="json"
                  value={JSON.stringify(detailObj.details, null, 2)}
                  theme={theme === THEME_MODES.DARK_THEME ? "vs-dark" : "light"}
                  options={{ ...monacoOptions, readOnly: true } as any}
                />
              )}
            </Accordion>
          </div>
        ))}
      </div>
    </>
  );
}

export default DetailJobResult;
