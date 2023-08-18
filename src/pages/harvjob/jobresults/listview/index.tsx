import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { queryJobResult } from "@/features/harvjob/harvjobSlice";
import JobResultList from "@/components/harvjob/jobresults/JobResultList";
import MainLayout from "@/components/layout/main";
import { HarvJobPagination } from "@/components/pagination";
import { Header, BackButton } from "@/components/common";
import { paramsToObject } from "@/utils/utils";
import "./styles.css";

function JobResultListView() {
  const { theme } = useAppSelector((state) => state.home);
  const { search } = useLocation();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const paramsObj = paramsToObject(search);
    dispatch(queryJobResult(paramsObj));
  }, [dispatch, search]);

  return (
    <MainLayout>
      <div className="container">
        <Header title={"HDS Job Results"} className={`display-6 mt-4 mb-4`} />
        <BackButton mb={"mb-4"} theme={theme} />
        <JobResultList />
        <HarvJobPagination attr="jobresult" />
      </div>
    </MainLayout>
  );
}

export default JobResultListView;
