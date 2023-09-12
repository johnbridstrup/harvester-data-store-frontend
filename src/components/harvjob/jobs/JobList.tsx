import moment from "moment";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAppSelector } from "@/app/hooks";
import { darkThemeClass, getUrl } from "@/utils/utils";
import { LoaderDiv } from "@/components/styled";
import { Loader } from "@/components/common";
import PayloadModal from "@/components/modals/PayloadModal";

function ListJobs() {
  const { jobs, loading } = useAppSelector((state) => state.harvjob);
  const { theme } = useAppSelector((state) => state.home);
  const [payload, setPayload] = useState<Record<string, any> | null>(null);
  const payloadRef = useRef<HTMLButtonElement | null>(null);
  const tabledt = darkThemeClass("dt-table", theme);

  const handleClick = (obj: Record<string, any>) => {
    setPayload(obj);
    payloadRef.current?.click();
  };

  return (
    <>
      {loading ? (
        <LoaderDiv>
          <Loader size={50} />
        </LoaderDiv>
      ) : (
        <div className="table-responsive mb-4">
          <table className={`table ${tabledt}`}>
            <thead>
              <tr>
                <th>ID</th>
                <th>JobType</th>
                <th>Schema</th>
                <th>Status</th>
                <th>Target</th>
                <th>Results</th>
                <th>History</th>
                <th>Payload</th>
                <th>Created At</th>
                <th>Updated At</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job, _) => (
                <tr key={job.id}>
                  <td>
                    <Link to={`/jobs/${job.id}`}>{job.id}</Link>
                  </td>

                  <td>{job.schema?.jobtype}</td>
                  <td>{job.schema?.version}</td>
                  <td
                    className={`${
                      job.jobstatus === "Success"
                        ? "text-success"
                        : job.jobstatus === "Pending"
                        ? "text-warning"
                        : "text-danger"
                    }`}
                  >
                    {job.jobstatus}
                  </td>
                  <td>{job.target.harv_id}</td>
                  <td>
                    <Link to={`/${getUrl(job.results)}`}>
                      <i className="las la-eye"></i>
                    </Link>
                  </td>
                  <td>
                    <Link to={`/jobstatus/${job.id}`}>
                      <i className="las la-eye"></i>
                    </Link>
                  </td>
                  <td>
                    <button
                      className="btn btn-sm"
                      onClick={() => handleClick(job.payload)}
                    >
                      View Payload
                    </button>{" "}
                    <button
                      ref={payloadRef}
                      data-bs-toggle="modal"
                      data-bs-target="#payloadModal"
                      style={{ display: "none" }}
                    >
                      View Payload
                    </button>
                  </td>
                  <td>{moment(job.created).format("LLLL")}</td>
                  <td>{moment(job.lastModified).format("LLLL")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <PayloadModal payload={payload} theme={theme as string} />
    </>
  );
}

export default ListJobs;
