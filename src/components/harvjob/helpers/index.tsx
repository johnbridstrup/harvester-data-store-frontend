import moment from "moment";
import { MutableRefObject } from "react";
import { JobStatus } from "@/features/harvjob/harvjobTypes";
import { darkThemeClass } from "@/utils/utils";

interface HistoryProps {
  jobstatuses: Array<JobStatus>;
  theme: string;
}

interface GroupProps {
  popUp: () => void;
  downloadRef: MutableRefObject<HTMLButtonElement | null>;
  confirmRef: MutableRefObject<HTMLButtonElement | null>;
  confirmPopUp: () => void;
  theme: string;
}

export const JobStatusHistory = (props: HistoryProps) => {
  const tabledt = darkThemeClass("dt-table", props.theme);
  return (
    <div className="table-responsive">
      <table className={`table ${tabledt}`}>
        <thead>
          <tr>
            <th>Status History</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {props.jobstatuses?.map((status, _) => (
            <tr key={status.history_id}>
              <td
                className={`${
                  status.jobstatus === "Success"
                    ? "text-success"
                    : status.jobstatus === "Pending"
                    ? "text-warning"
                    : "text-danger"
                } `}
              >
                {status.jobstatus}
              </td>
              <td>{moment(status.history_date).format("LLLL")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export const RightButtonGroup = (props: GroupProps) => {
  const btn = darkThemeClass("btn-dark", props.theme);
  return (
    <div className="flex-right mb-2">
      <span
        onClick={props.confirmPopUp}
        className={`btn btn-default mx-2 ${btn}`}
      >
        Reschedule
      </span>
      <span onClick={props.popUp} className={`btn btn-default mx-2 ${btn}`}>
        Get Files
      </span>
      <button
        ref={props.downloadRef}
        data-bs-toggle="modal"
        data-bs-target="#downloadModal"
        style={{ display: "none" }}
      >
        Get Files
      </button>
      <button
        ref={props.confirmRef}
        data-bs-toggle="modal"
        data-bs-target="#confirmModal"
        style={{ display: "none" }}
      >
        Reschedule
      </button>
    </div>
  );
};
