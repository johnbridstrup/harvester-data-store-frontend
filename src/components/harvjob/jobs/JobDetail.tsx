import moment from "moment";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { rescheduleJob } from "@/features/harvjob/harvjobSlice";
import { SUCCESS } from "@/features/base/constants";
import { darkThemeClass, timeStampFormat } from "@/utils/utils";
import { handleDownload } from "@/components/common";
import DownloadModal from "@/components/modals/DownloadModal";
import ConfirmModal from "@/components/modals/ConfirmModal";
import PayloadModal from "@/components/modals/PayloadModal";
import { RightButtonGroup, JobStatusHistory } from "../helpers";

function JobDetail() {
  const [scheduling, setScheduling] = useState(false);
  const [payload, setPayload] = useState<Record<string, any> | null>(null);
  const { job, jobresults, jobstatuses } = useAppSelector(
    (state) => state.harvjob,
  );
  const { theme } = useAppSelector((state) => state.home);
  const dispatch = useAppDispatch();
  const downloadRef = useRef<HTMLButtonElement | null>(null);
  const confirmRef = useRef<HTMLButtonElement | null>(null);
  const payloadRef = useRef<HTMLButtonElement | null>(null);

  const downloadPopUp = () => {
    downloadRef.current?.click();
  };

  const download = async (fileObj: { url: string }) => {
    await handleDownload(fileObj);
  };

  const confirmPopUp = () => {
    confirmRef.current?.click();
  };

  const handleClick = (obj: Record<string, any>) => {
    setPayload(obj);
    payloadRef.current?.click();
  };

  const handleReschedule = async () => {
    setScheduling(true);
    const res = await dispatch(rescheduleJob(Number(job?.id)));
    if (res.payload?.status === SUCCESS) {
      toast.success(res.payload?.message);
      confirmPopUp();
    } else {
      confirmPopUp();
      toast.error(res.payload);
    }
    setScheduling(false);
  };

  const cardtheme = darkThemeClass("dt-card-theme", theme);
  const tabledt = darkThemeClass("dt-table", theme);

  return (
    <>
      <RightButtonGroup
        downloadRef={downloadRef}
        popUp={downloadPopUp}
        confirmPopUp={confirmPopUp}
        confirmRef={confirmRef}
        theme={theme as string}
      />
      <div className="mb-4 mt-3" data-testid="job-detail">
        <div className={`card card-body mb-4 ${cardtheme}`}>
          <div className="row">
            <div className="col-md-3 mb-2">
              <div className="f-w-600">ID</div>
              <div>{job?.id}</div>
            </div>
            <div className="col-md-3 mb-2">
              <div className="f-w-600">Payload</div>
              <div>
                <button
                  className="btn btn-sm"
                  onClick={() =>
                    handleClick(job?.payload as Record<string, any>)
                  }
                >
                  View
                </button>{" "}
                <button
                  ref={payloadRef}
                  data-bs-toggle="modal"
                  data-bs-target="#payloadModal"
                  style={{ display: "none" }}
                >
                  View
                </button>
              </div>
            </div>
            <div className="col-md-3 mb-2">
              <div className="f-w-600">Job Type</div>
              <div>{job?.schema?.jobtype}</div>
            </div>
            <div className="col-md-3 mb-2">
              <div className="f-w-600">Schema Version</div>
              <div>{job?.schema?.version}</div>
            </div>
            <div className="col-md-3 mb-2">
              <div className="f-w-600">Status</div>
              <div
                className={`${
                  job?.jobstatus === "Success"
                    ? "text-success"
                    : job?.jobstatus === "Pending"
                    ? "text-warning"
                    : "text-danger"
                }`}
              >
                {job?.jobstatus}
              </div>
            </div>
            <div className="col-md-3 mb-2">
              <div className="f-w-600">Target</div>
              <div>{job?.target?.harv_id}</div>
            </div>
            <div className="col-md-3 mb-2">
              <div className="f-w-600">Created At</div>
              <div>{moment(job?.created).format("LLLL")}</div>
            </div>
            <div className="col-md-3 mb-2">
              <div className="f-w-600">Updated At</div>
              <div>{moment(job?.lastModified).format("LLLL")}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="f-w-600">Job Results</div>
      <div className="table-responsive">
        <table className={`table ${tabledt}`}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Time</th>
              <th>Host Results</th>
              <th>HarvID</th>
              <th>Created At</th>
              <th>Updated At</th>
            </tr>
          </thead>
          <tbody>
            {jobresults.map((result, _) => (
              <tr key={result.id}>
                <td>
                  <Link to={`/jobresults/${result.id}`}>{result.id}</Link>
                </td>
                <td>{timeStampFormat(new Date(result.reportTime))}</td>
                <td>
                  {result.host_results.map((host, _id) => (
                    <div key={host.id}>
                      <span>{host.host}</span>{" "}
                      <span
                        className={`${
                          host.result === "Success"
                            ? "text-success"
                            : host.result === "Pending"
                            ? "text-warning"
                            : "text-danger"
                        }`}
                      >
                        {host.result}
                      </span>
                    </div>
                  ))}
                </td>
                <td>{result.report?.serial_number}</td>
                <td>{moment(result.created).format("LLLL")}</td>
                <td>{moment(result.lastModified).format("LLLL")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="f-w-600">Job Status</div>
      <JobStatusHistory jobstatuses={jobstatuses} theme={theme as string} />
      <DownloadModal
        eventObj={job?.event}
        handleDownload={download}
        theme={theme as string}
      />
      <ConfirmModal
        cancelRequest={confirmPopUp}
        confirmRef={confirmRef}
        confirmRequest={handleReschedule}
        msg={"Are you sure you want to reschedule this job"}
        loading={scheduling}
        theme={theme}
      />
      <PayloadModal payload={payload} theme={theme as string} />
    </>
  );
}

export default JobDetail;
