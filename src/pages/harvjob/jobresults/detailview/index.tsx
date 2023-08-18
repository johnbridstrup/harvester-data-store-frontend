import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { getJobResult } from "@/features/harvjob/harvjobSlice";
import MainLayout from "@/components/layout/main";
import JobResultDetail from "@/components/harvjob/jobresults/JobResultDetail";
import { LoaderDiv } from "@/components/styled";
import { Header, BackButton, Loader } from "@/components/common";
import "./styles.css";

function JobResultDetailView() {
  const { loading } = useAppSelector((state) => state.harvjob);
  const { theme } = useAppSelector((state) => state.home);
  const dispatch = useAppDispatch();
  const { jobresultId } = useParams();

  useEffect(() => {
    dispatch(getJobResult(Number(jobresultId)));
  }, [dispatch, jobresultId]);

  return (
    <MainLayout>
      <div className="container">
        <Header
          title={"HDS Job Results"}
          className={`display-6 mt-4 mb-4`}
          id={jobresultId}
        />
        <BackButton mb={"mb-4"} theme={theme} />
        {loading ? (
          <LoaderDiv>
            <Loader size={50} />
          </LoaderDiv>
        ) : (
          <JobResultDetail />
        )}
      </div>
    </MainLayout>
  );
}

export default JobResultDetailView;
