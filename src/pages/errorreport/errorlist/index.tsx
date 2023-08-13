import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAppDispatch } from "@/app/hooks";
import MainLayout from "@/components/layout/main";
import ErrorReportQuery from "@/components/errorreport/ErrorReportQuery";
import ErrorReportTable from "@/components/errorreport/ErrorReportTable";
import { queryHarvester } from "@/features/harvester/harvesterSlice";
import { queryLocation } from "@/features/location/locationSlice";
import {
  copyQueryUrl,
  queryErrorReport,
} from "@/features/errorreport/errorreportSlice";
import { Pagination } from "@/components/pagination";
import { copiedUrl, paramsToObject } from "@/utils/utils";
import { CopyToClipboard } from "@/components/copytoclipboard";
import { MAX_LIMIT } from "@/features/base/constants";
import { queryFruit } from "@/features/harvester/harvesterSlice";
import { queryExceptionCode } from "@/features/exception/exceptionSlice";
import { queryUsers } from "@/features/users/usersSlice";
import { Header } from "@/components/common";
import "./styles.css";

function ErrorReportListView() {
  const dispatch = useAppDispatch();
  const { search } = useLocation();

  useEffect(() => {
    (async () => {
      await Promise.all([
        dispatch(queryHarvester({ limit: MAX_LIMIT })),
        dispatch(queryLocation({ limit: MAX_LIMIT })),
        dispatch(queryFruit({ limit: MAX_LIMIT })),
        dispatch(queryExceptionCode({ limit: MAX_LIMIT })),
        dispatch(queryUsers({ limit: MAX_LIMIT })),
      ]);
    })();
    if (search) {
      const paramsObj = paramsToObject(search);
      dispatch(queryErrorReport(paramsObj));
      dispatch(copyQueryUrl(copiedUrl(paramsObj)));
    } else {
      dispatch(queryErrorReport({ is_emulator: 0 }));
    }
    return () => {};
  }, [dispatch, search]);

  return (
    <MainLayout>
      <div className="container">
        <div>
          <Header
            title={"HDS Error Reports"}
            className={"display-6 mt-4 mb-4"}
          />
        </div>
        <ErrorReportQuery />
        <ErrorReportTable />
        <Pagination />
        <CopyToClipboard />
      </div>
    </MainLayout>
  );
}

export default ErrorReportListView;
