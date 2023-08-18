import moment from "moment";
import { Link } from "react-router-dom";
import { useAppSelector } from "@/app/hooks";
import { darkThemeClass, timeStampFormat } from "@/utils/utils";
import { Loader } from "../common";
import { LoaderDiv } from "@/components/styled";

function VersionReportList() {
  const { harvversions, loading } = useAppSelector((state) => state.harvdeploy);
  const { timezone } = useAppSelector((state) => state.errorreport);
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
                <th>Harvester</th>
                <th>Created At</th>
                <th>Updated At</th>
              </tr>
            </thead>
            <tbody>
              {harvversions.map((version, _) => (
                <tr key={version.id}>
                  <td>{version.id}</td>
                  <td>
                    <Link to={`/harvversion/${version.id}`}>
                      {timeStampFormat(
                        new Date(version.reportTime),
                        timezone as string,
                      )}
                    </Link>
                  </td>
                  <td>{version.is_dirty ? "True" : "False"}</td>
                  <td>{version.report?.data?.serial_number}</td>
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

export default VersionReportList;
