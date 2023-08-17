import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import MainLayout from "@/components/layout/main";
import { getJobSchema } from "@/features/harvjob/harvjobSlice";
import JobSchemaDetail from "@/components/harvjob/jobschemas/JobSchemaDetail";
import { Header, Loader, BackButton } from "@/components/common";
import { LoaderDiv } from "@/components/styled";
import "./styles.css";

function JobSchemaDetailView() {
  const { loading } = useAppSelector((state) => state.harvjob);
  const { theme } = useAppSelector((state) => state.home);
  const { jobschemaId } = useParams();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getJobSchema(Number(jobschemaId)));
  }, [dispatch, jobschemaId]);

  return (
    <MainLayout>
      <div className="container">
        <Header
          title={"HDS Job Schemas"}
          className={`display-6 mt-4 mb-4`}
          id={jobschemaId}
        />
        <BackButton mb={"mb-4"} theme={theme} />
        {loading ? (
          <LoaderDiv>
            <Loader size={50} />
          </LoaderDiv>
        ) : (
          <JobSchemaDetail />
        )}
      </div>
    </MainLayout>
  );
}

export default JobSchemaDetailView;
