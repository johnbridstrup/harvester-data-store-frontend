import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  getJob,
  queryJobStatus,
  queryJobResult,
} from "@/features/harvjob/harvjobSlice";
import JobDetail from "@/components/harvjob/jobs/JobDetail";
import MainLayout from "@/components/layout/main";
import { LoaderDiv } from "@/components/styled";
import { Loader, BackButton, Header } from "@/components/common";
import "./styles.css";

function JobDetailView() {
  const { loading } = useAppSelector((state) => state.harvjob);
  const { theme } = useAppSelector((state) => state.home);
  const dispatch = useAppDispatch();
  const { jobId } = useParams();

  useEffect(() => {
    (async () => {
      const res = await dispatch(getJob(Number(jobId)));
      await Promise.all([
        dispatch(
          queryJobResult({ job__event__UUID: res.payload?.event?.UUID }),
        ),
        dispatch(queryJobStatus(Number(jobId))),
      ]);
    })();
  }, [dispatch, jobId]);

  return (
    <MainLayout>
      <div className="container">
        <Header
          title={"HDS Jobs"}
          className={`display-6 mt-4 mb-4`}
          id={jobId}
        />
        <BackButton mb={"mb-4"} theme={theme} />
        {loading ? (
          <LoaderDiv>
            <Loader size={50} />
          </LoaderDiv>
        ) : (
          <JobDetail />
        )}
      </div>
    </MainLayout>
  );
}

export default JobDetailView;
