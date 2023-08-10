import { Link } from "react-router-dom";
import { useAppSelector } from "@/app/hooks";
import { darkThemeClass, timeStampFormat } from "@/utils/utils";
import { Loader } from "@/components/common";
import { ReportPagination } from "../pagination";
import { LoaderDiv } from "../styled";

function RecentHarvesterErrors() {
  const { reports, timezone, loading } = useAppSelector(
    (state) => state.errorreport,
  );
  const { theme } = useAppSelector((state) => state.home);
  const tabledt = darkThemeClass("dt-table", theme);

  return (
    <>
      <div className="recent-error">Recent Errors</div>
      <div className="table-responsive">
        {loading ? (
          <LoaderDiv>
            <Loader size={25} />
          </LoaderDiv>
        ) : (
          <table className={`table ${tabledt}`}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Time</th>
                <th>Code</th>
                <th>Services</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report, _) => (
                <tr key={report.id}>
                  <td>{report.reportId}</td>
                  <td>
                    <Link to={`/errorreports/${report.reportId}`}>
                      {timeStampFormat(
                        new Date(report.reportTime),
                        timezone as string,
                      )}
                    </Link>
                  </td>
                  <td>{report.code}</td>
                  <td>{report.service}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <ReportPagination />
    </>
  );
}

export default RecentHarvesterErrors;
