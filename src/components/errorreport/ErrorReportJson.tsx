import { useState } from "react";
import Editor from "@monaco-editor/react";
import { darkThemeClass, monacoOptions } from "@/utils/utils";
import { TransformErrorReport } from "@/features/errorreport/errorreportTypes";
import { THEME_MODES } from "@/features/base/constants";

interface ReportProps {
  reportObj: TransformErrorReport | null;
  theme: string;
}

function ErrorReportJson(props: ReportProps) {
  const [toggleOpen, setToggleOpen] = useState(false);

  const handleOpenJson = () => {
    setToggleOpen(!toggleOpen);
    setTimeout(() => {
      window.scrollTo(
        0,
        document.body.scrollHeight || document.documentElement.scrollHeight,
      );
    }, 100);
  };

  const exportJson = () => {
    const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
      JSON.stringify(props.reportObj?.report, null, 4),
    )}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = "data.json";
    link.click();
  };

  const btn = darkThemeClass("btn-dark", props.theme);

  return (
    <>
      <div>
        <span onClick={handleOpenJson} className={`btn btn-default ${btn}`}>
          {toggleOpen ? "Hide" : "Show"} JSON <i className="las la-code"></i>
        </span>
        <span onClick={exportJson} className={`btn btn-default mx-2 ${btn}`}>
          Download <i className="las la-download"></i>
        </span>
      </div>
      {toggleOpen && (
        <div className="mt-2">
          <Editor
            height="40vh"
            language="python"
            value={JSON.stringify(props.reportObj?.report, null, 2)}
            theme={props.theme === THEME_MODES.DARK_THEME ? "vs-dark" : "light"}
            options={{ ...monacoOptions, readOnly: true } as any}
          />
        </div>
      )}
    </>
  );
}

export default ErrorReportJson;
