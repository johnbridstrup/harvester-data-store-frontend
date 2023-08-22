import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { getScheduledJob } from "@/features/jobscheduler/jobschedulerSlice";
import MainLayout from "@/components/layout/main";
import { LoaderDiv } from "@/components/styled";
import ScheduledJobDetail from "@/components/jobscheduler/ScheduledJobDetail";
import { Header, BackButton, Loader } from "@/components/common";
import "./styles.css";

function ScheduledJobDetailView() {
  const { loading } = useAppSelector((state) => state.jobscheduler);
  const { theme } = useAppSelector((state) => state.home);
  const { jobId } = useParams();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getScheduledJob(Number(jobId)));
  }, [dispatch, jobId]);

  return (
    <MainLayout>
      <div className="container">
        <Header
          title={"HDS Scheduled Job"}
          className={`display-6 mt-4 mb-4`}
          id={jobId}
        />
        <BackButton mb={"mb-4"} theme={theme} />
        {loading ? (
          <LoaderDiv>
            <Loader size={50} />
          </LoaderDiv>
        ) : (
          <ScheduledJobDetail />
        )}
      </div>
    </MainLayout>
  );
}

export default ScheduledJobDetailView;
