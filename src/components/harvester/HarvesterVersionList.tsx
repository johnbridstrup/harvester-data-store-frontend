import moment from "moment";
import { useAppSelector } from "@/app/hooks";
import { Link } from "react-router-dom";
import { darkThemeClass, timeStampFormat } from "@/utils/utils";
import { LoaderDiv } from "../styled";
import { Loader } from "../common";

function HarvesterVersionList() {
  const { harvversion, loading } = useAppSelector((state) => state.harvester);
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
                <th>Time</th>
                <th>Dirty</th>
                <th>Created At</th>
                <th>Updated At</th>
              </tr>
            </thead>
            <tbody>
              {harvversion.map((version, _) => (
                <tr key={version.id}>
                  <td>{version.id}</td>
                  <td>
                    <Link to={`/harvversion/${version.id}`}>
                      {timeStampFormat(new Date(version.reportTime))}
                    </Link>
                  </td>
                  <td>{version.is_dirty ? "True" : "False"}</td>
                  <td>{moment(version.created).format("LLLL")}</td>
                  <td>{moment(version.lastModified).format("LLLL")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default HarvesterVersionList;
