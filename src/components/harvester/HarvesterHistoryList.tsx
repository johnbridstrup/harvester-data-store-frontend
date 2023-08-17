import moment from "moment";
import { Link } from "react-router-dom";
import { useAppSelector } from "@/app/hooks";
import { darkThemeClass, getHistoryType } from "@/utils/utils";
import { Loader } from "../common";
import { LoaderDiv } from "../styled";

function HarvesterHistoryList() {
  const { historys, loading } = useAppSelector((state) => state.harvester);
  const { theme } = useAppSelector((state) => state.home);
  const tabledt = darkThemeClass("dt-table", theme);
  return (
    <div className="mb-4">
      <div className="table-responsive">
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
                <th>Harv ID</th>
                <th>Fruit</th>
                <th>Location</th>
                <th>Emulator</th>
                <th>History Date</th>
                <th>History Type</th>
                <th>Created At</th>
                <th>Updated At</th>
              </tr>
            </thead>
            <tbody>
              {historys.map((obj, _) => (
                <tr key={obj.history_id}>
                  <td>{obj.history_id}</td>
                  <td>
                    <Link to={`/harvesterhistory/${obj.history_id}`}>
                      {obj.name}
                    </Link>
                  </td>
                  <td>{obj.harv_id}</td>
                  <td>{obj.fruit?.name}</td>
                  <td>{obj.location?.ranch}</td>
                  <td>{obj.is_emulator ? "True" : "False"}</td>
                  <td>{moment(obj.history_date).format("LLLL")}</td>
                  <td>{getHistoryType(obj.history_type)}</td>
                  <td>{moment(obj.created).format("LLLL")}</td>
                  <td>{moment(obj.lastModified).format("LLLL")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default HarvesterHistoryList;
