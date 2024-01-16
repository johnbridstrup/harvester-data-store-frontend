import { useMemo, FC, ChangeEvent } from "react";
import { Content } from "@/features/logparser/logparserTypes";
import { LOG_LEVEL } from "@/features/base/constants";
import { darkThemeClass, logContent } from "@/utils/utils";

interface LogProps {
  log: Content;
  handleClick: (index: number, obj: Content) => void;
  logIndex: number;
  className: string;
}

interface LogSwitchProps {
  toggleLogView: () => void;
  logView: boolean;
  theme: string;
  id?: number;
}

interface MarkerProps {
  timestamp: number | undefined;
  handleTsChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleKeyDown: (event: any) => void;
  currentIndex: number | null;
  clearSelection: () => void;
  theme: string;
}

export const LogHighlighter = (props: LogProps) => {
  const { logIndex, log, handleClick, className } = props;
  const logObj = useMemo(
    () => logContent(log.log_message, log.logfile_type),
    [log.log_message, log.logfile_type],
  );
  let levelClassName =
    logObj.log_level === LOG_LEVEL.DEBUG
      ? "text-primary"
      : logObj.log_level === LOG_LEVEL.WARNING
      ? "text-warning"
      : logObj.log_level === LOG_LEVEL.ERROR
      ? "text-danger"
      : logObj.log_level === LOG_LEVEL.CRITICAL
      ? "text-danger"
      : logObj.log_level === LOG_LEVEL.INFO
      ? "text-success"
      : "";
  return (
    <div onClick={() => handleClick(logIndex, log)} className={className}>
      <>
        [<span className="text-primary">{logObj.timestamp}</span>]{" "}
      </>
      <>
        [<span className={levelClassName}>{logObj.log_level}</span>]{" "}
      </>
      <>
        [<span className="text-primary">{logObj.service} </span>]{" "}
      </>
      <span>{logObj.log} </span>
    </div>
  );
};

export const LogSwitch = ({
  toggleLogView,
  logView,
  theme,
  id,
}: LogSwitchProps) => {
  const btn = darkThemeClass("btn-dark", theme);
  const onNewWindow = () => {
    const baseURL =
      import.meta.env.REACT_APP_HOSTED_URL || "http://localhost:3000";
    const endpoint = `/logfiles/${id}/logs`;
    const url = `${baseURL}${endpoint}`;
    const params = "width=900,height=600,popup";
    window.open(url, "_blank", params);
  };
  return (
    <div className="logview">
      <span className={`btn btn-sm mx-2 ${btn}`} onClick={onNewWindow}>
        Add New Log Window
      </span>
      <span onClick={toggleLogView} className={`btn btn-sm ${btn}`}>
        {logView
          ? "Switch To Log Entries Without Video"
          : "Switch To Log Entries With Video"}
      </span>
    </div>
  );
};

export const CurrentMarker: FC<MarkerProps> = ({
  timestamp,
  handleTsChange,
  handleKeyDown,
  currentIndex,
  clearSelection,
  theme,
}) => {
  const inputdark = darkThemeClass("dt-log-search", theme);
  return (
    <div className="current-marker">
      <div>
        current selection at time:{" "}
        <input
          className={`paste-ts ${inputdark}`}
          value={timestamp}
          onChange={handleTsChange}
          onKeyDown={handleKeyDown}
        />{" "}
        index: {currentIndex}
      </div>
      <div className="cursor">
        <i onClick={clearSelection} className="las la-times"></i>
      </div>
    </div>
  );
};
