import moment from "moment";
import { Link } from "react-router-dom";
import { useAppSelector } from "@/app/hooks";
import { LoaderDiv } from "@/components/styled";
import { darkThemeClass } from "@/utils/utils";
import { Loader } from "@/components/common";

function LogSessionList() {
  const { loading, logsessions } = useAppSelector((state) => state.logparser);
  const { theme } = useAppSelector((state) => state.home);
  const tabledt = darkThemeClass("dt-table", theme);
  return (
    <div className="table-responsive mb-4">
      {loading ? (
        <LoaderDiv>
          <Loader size={50} />
        </LoaderDiv>
      ) : (
        <table className={`table ${tabledt}`}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Harvester</th>
              <th>Log Date</th>
              <th>Created At</th>
              <th>Updated At</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {logsessions.map((log, _) => (
              <tr key={log.id}>
                <td>{log.id}</td>
                <td>
                  <Link to={`/logsession/${log.id}`}>{log.name}</Link>
                </td>
                <td>{log.logs?.harv_id}</td>
                <td>{moment(log.date_time).format("LLLL")}</td>
                <td>{moment(log.created).format("LLLL")}</td>
                <td>{moment(log.lastModified).format("LLLL")}</td>
                <td>
                  <Link to={`/logfiles/${log.id}`}>View Logs</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default LogSessionList;
