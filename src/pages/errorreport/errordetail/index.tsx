import { useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { CustomBackButton, Header, Loader } from "@/components/common";
import ErrorReportDetail from "@/components/errorreport/ErrorReportDetail";
import MainLayout from "@/components/layout/main";
import { LoaderDiv } from "@/components/styled";
import { getErrorReport } from "@/features/errorreport/errorreportSlice";
import { paramsToObject } from "@/utils/utils";
import "./styles.css";

function ErrorReportDetailView() {
  const { loading } = useAppSelector((state) => state.errorreport);
  const { theme } = useAppSelector((state) => state.home);
  const params = useParams();
  const dispatch = useAppDispatch();
  const { search } = useLocation();
  const paramsObj = paramsToObject(search);

  useEffect(() => {
    dispatch(getErrorReport(Number(params.reportId)));
  }, [dispatch, params]);

  return (
    <MainLayout>
      <div className="container">
        <div>
          <CustomBackButton
            routeTo="errorreports"
            theme={theme as string}
            paramsObj={paramsObj}
          />
          <Header
            title={"HDS Error Reports"}
            className={"display-6 mb-4"}
            id={params.reportId}
          />
        </div>

        {loading ? (
          <LoaderDiv>
            <Loader size={50} />
          </LoaderDiv>
        ) : (
          <ErrorReportDetail />
        )}
      </div>
    </MainLayout>
  );
}

export default ErrorReportDetailView;
