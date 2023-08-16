import moment from "moment";
import { Link } from "react-router-dom";
import { useAppSelector } from "@/app/hooks";
import { LoaderDiv } from "@/components/styled";
import { Loader } from "../common";
import { darkThemeClass, timeStampFormat } from "@/utils/utils";

function AutodiagList() {
  const { reports, loading } = useAppSelector((state) => state.autodiagnostic);
  const { timezone } = useAppSelector((state) => state.errorreport);
  const { theme } = useAppSelector((state) => state.home);
  const tabledt = darkThemeClass("dt-table", theme);

  return (
    <>
      {loading ? (
        <LoaderDiv>
          <Loader size={50} />
        </LoaderDiv>
      ) : (
        <div className="table-responsive">
          <table className={`table ${tabledt}`}>
            <thead>
              <tr>
                <th>Report Time</th>
                <th>Result</th>
                <th>Robot</th>
                <th>Gripper SN</th>
                <th>Harvester</th>
                <th>Fruit</th>
                <th>Event</th>
                <th>Pick Session</th>
                <th>Created At</th>
                <th>Updated At</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((obj, _) => (
                <tr key={obj.id}>
                  <td>
                    <Link to={`/autodiagnostics/${obj.id}`}>
                      {timeStampFormat(
                        new Date(obj.reportTime),
                        timezone as string,
                      )}
                    </Link>
                  </td>
                  <td>{obj.result ? "success" : "failed"}</td>
                  <td>{obj.robot}</td>
                  <td>{obj.gripper_sn}</td>
                  <td>
                    <Link to={`/harvesters/${obj.harvester}`}>
                      {obj.report?.serial_number}
                    </Link>
                  </td>
                  <td>{obj.report?.fruit}</td>
                  <td>
                    <Link to={`/events/${obj.event}`}>{obj.event}</Link>
                  </td>
                  <td>
                    <Link to={`/picksessions/${obj.pick_session}`}>
                      {obj.pick_session}
                    </Link>
                  </td>
                  <td>{moment(obj.created).format("LLLL")}</td>
                  <td>{moment(obj.lastModified).format("LLLL")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

export default AutodiagList;
