import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAppDispatch } from "@/app/hooks";
import { MAX_LIMIT } from "@/features/base/constants";
import { queryHarvester } from "@/features/harvester/harvesterSlice";
import { queryJob } from "@/features/harvjob/harvjobSlice";
import JobQuery from "@/components/harvjob/jobs/JobQuery";
import JobList from "@/components/harvjob/jobs/JobList";
import { Header } from "@/components/common";
import MainLayout from "@/components/layout/main";
import { HarvJobPagination } from "@/components/pagination";
import { paramsToObject } from "@/utils/utils";
import "./styles.css";

function JobListView() {
  const dispatch = useAppDispatch();
  const { search } = useLocation();

  useEffect(() => {
    (async () => {
      await Promise.all([
        dispatch(queryJob(paramsToObject(search))),
        dispatch(queryHarvester({ limit: MAX_LIMIT })),
      ]);
    })();
  }, [dispatch, search]);

  return (
    <MainLayout>
      <div className="container">
        <Header title={"HDS Jobs"} className={`display-6 mt-4 mb-4`} />
        <JobQuery />
        <JobList />
        <HarvJobPagination />
      </div>
    </MainLayout>
  );
}

export default JobListView;
