import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import ErrorReportPareto from "@/components/errorreport/ErrorReportPareto";
import { Header, BackButton } from "@/components/common";
import MainLayout from "@/components/layout/main";
import { generatePareto } from "@/features/errorreport/errorreportSlice";
import { paramsToObject } from "@/utils/utils";
import { queryFruit } from "@/features/harvester/harvesterSlice";
import { queryLocation } from "@/features/location/locationSlice";
import { queryExceptionCode } from "@/features/exception/exceptionSlice";
import { MAX_LIMIT } from "@/features/base/constants";
import "./styles.css";

function ErrorReportParetoView() {
  const { theme } = useAppSelector((state) => state.home);
  const dispatch = useAppDispatch();
  const { search } = useLocation();
  const paramsObj = paramsToObject(search);

  useEffect(() => {
    (async () => {
      dispatch(generatePareto(paramsObj));
      await Promise.all([
        // dispatch(queryHarvester(MAX_LIMIT)),
        dispatch(queryLocation({ limit: MAX_LIMIT })),
        dispatch(queryFruit({ limit: MAX_LIMIT })),
        dispatch(queryExceptionCode({ limit: MAX_LIMIT })),
      ]);
    })();
  }, [dispatch, paramsObj]);

  return (
    <MainLayout>
      <div className="container">
        <BackButton theme={theme} />
        <Header title={"Error Pareto"} className={"display-6 mb-4"} />
        <ErrorReportPareto />
      </div>
    </MainLayout>
  );
}

export default ErrorReportParetoView;
