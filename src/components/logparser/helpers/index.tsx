import { useMemo } from "react";
import { Content } from "@/features/logparser/logparserTypes";
import { LOG_LEVEL } from "@/features/base/constants";
import { logContent } from "@/utils/utils";

interface LogProps {
  log: Content;
  handleClick: (index: number, obj: Content) => void;
  logIndex: number;
  className: string;
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
