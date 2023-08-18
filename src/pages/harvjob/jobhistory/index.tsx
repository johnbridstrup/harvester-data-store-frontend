import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { queryJobStatus } from "@/features/harvjob/harvjobSlice";
import MainLayout from "@/components/layout/main";
import JobHistoryList from "@/components/harvjob/jobhistory/JobHistoryList";
import { HarvJobPagination } from "@/components/pagination";
import { Header, BackButton } from "@/components/common";
import "./styles.css";

function JobHistoryView() {
  const { theme } = useAppSelector((state) => state.home);
  const dispatch = useAppDispatch();
  const { jobId } = useParams();

  useEffect(() => {
    dispatch(queryJobStatus(Number(jobId)));
  }, [dispatch, jobId]);

  return (
    <MainLayout>
      <div className="container">
        <Header
          title={"HDS Job Status"}
          className={`display-6 mt-4 mb-4`}
          id={jobId}
        />
        <BackButton mb={"mb-4"} theme={theme} />
        <JobHistoryList />
        <HarvJobPagination attr="jobstatus" />
      </div>
    </MainLayout>
  );
}

export default JobHistoryView;
