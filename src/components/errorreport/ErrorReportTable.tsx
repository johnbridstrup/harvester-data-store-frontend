import { FormEvent } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { Exception } from "@/features/exception/exceptionTypes";
import { HarvesterMinimal, LocationMinimal } from "@/features/base/types";
import { hoverEffect } from "@/features/errorreport/errorreportSlice";
import { darkThemeClass, timeStampFormat } from "@/utils/utils";
import { Loader } from "../common";
import { Container, LoaderDiv, SpanTarget, Table, Td } from "../styled";

function ErrorReportTable() {
  const {
    reports,
    loading,
    timezone,
    internal: { searchObj },
  } = useAppSelector((state) => state.errorreport);
  const { theme } = useAppSelector((state) => state.home);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { search } = useLocation();

  const navigateToDetail = (e: FormEvent, reportId: number) => {
    e.preventDefault();
    const params = new URLSearchParams(searchObj || {});
    if (searchObj) {
      navigate(`/errorreports/${reportId}?${params.toString()}`);
    } else {
      navigate(`/errorreports/${reportId}${search.toString()}`);
    }
  };

  const handleOnMouseEnter = (
    target: string,
    obj: HarvesterMinimal | LocationMinimal | Array<Exception>,
  ) => {
    dispatch(hoverEffect({ obj, type: target.toUpperCase() }));
  };

  const tabledt = darkThemeClass("dt-table", theme);
  const rowdt = darkThemeClass("dt-row", theme);

  return (
    <Container className="table-responsive">
      {loading ? (
        <LoaderDiv>
          <Loader size={50} />
        </LoaderDiv>
      ) : (
        <Table className={`table ${tabledt}`}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Time</th>
              <th>Harvester</th>
              <th>Location</th>
              <th>Code</th>
              <th>Services</th>
              <th>Branch</th>
              <th>Githash</th>
            </tr>
          </thead>
          <tbody className="report-tbody">
            {reports.map((report) => (
              <tr key={report.reportId} className={`tr-hover cursor ${rowdt}`}>
                <td>
                  <Link
                    to={`/errorreports/${report.reportId}`}
                    onClick={(e) => navigateToDetail(e, report.reportId)}
                  >
                    {report.reportId}
                  </Link>
                </td>
                <td>
                  <Link
                    to={`/errorreports/${report.reportId}`}
                    onClick={(e) => navigateToDetail(e, report.reportId)}
                    className="table-link"
                  >
                    {timeStampFormat(
                      new Date(report.reportTime),
                      timezone as string,
                    )}
                  </Link>
                </td>
                <Td>
                  <Link
                    to={`/errorreports/${report.reportId}`}
                    onClick={(e) => navigateToDetail(e, report.reportId)}
                    className="table-link"
                  >
                    <SpanTarget
                      onMouseEnter={() =>
                        handleOnMouseEnter("harvester", report.harvester)
                      }
                    >
                      {report.harvester.harv_id}
                    </SpanTarget>
                  </Link>
                </Td>
                <Td>
                  <Link
                    to={`/errorreports/${report.reportId}`}
                    onClick={(e) => navigateToDetail(e, report.reportId)}
                    className="table-link"
                  >
                    <SpanTarget
                      onMouseEnter={() =>
                        handleOnMouseEnter("location", report.location)
                      }
                    >
                      {report.location.ranch}
                    </SpanTarget>
                  </Link>
                </Td>
                <Td>
                  <Link
                    to={`/errorreports/${report.reportId}`}
                    onClick={(e) => navigateToDetail(e, report.reportId)}
                    className="table-link"
                  >
                    <SpanTarget
                      onMouseEnter={() =>
                        handleOnMouseEnter("code", report.exceptions)
                      }
                    >
                      {report.code}
                    </SpanTarget>
                  </Link>
                </Td>
                <td>
                  <Link
                    to={`/errorreports/${report.reportId}`}
                    onClick={(e) => navigateToDetail(e, report.reportId)}
                    className="table-link"
                  >
                    {report.service}
                  </Link>
                </td>
                <td>
                  <Link
                    to={`/errorreports/${report.reportId}`}
                    onClick={(e) => navigateToDetail(e, report.reportId)}
                    className="table-link"
                  >
                    {report.branch_name}
                  </Link>
                </td>
                <td>
                  <Link
                    to={`/errorreports/${report.reportId}`}
                    onClick={(e) => navigateToDetail(e, report.reportId)}
                    className="table-link"
                  >
                    {report.githash}
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
}

export default ErrorReportTable;
