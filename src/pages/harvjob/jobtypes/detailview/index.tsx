import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { getJobType } from "@/features/harvjob/harvjobSlice";
import JobTypeDetail from "@/components/harvjob/jobtypes/JobTypeDetail";
import { BackButton, Header, Loader } from "@/components/common";
import MainLayout from "@/components/layout/main";
import { LoaderDiv } from "@/components/styled";
import "./styles.css";

function JobTypeDetailView() {
  const { loading } = useAppSelector((state) => state.harvjob);
  const { theme } = useAppSelector((state) => state.home);
  const { jobtypeId } = useParams();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getJobType(Number(jobtypeId)));
  }, [dispatch, jobtypeId]);

  return (
    <MainLayout>
      <div className="container">
        <Header
          title={`HDS JobTypes`}
          className={`display-6 mt-4 mb-4`}
          id={jobtypeId}
        />
        <BackButton mb={"mb-4"} theme={theme} />
        {loading ? (
          <LoaderDiv>
            <Loader size={50} />
          </LoaderDiv>
        ) : (
          <JobTypeDetail />
        )}
      </div>
    </MainLayout>
  );
}

export default JobTypeDetailView;
