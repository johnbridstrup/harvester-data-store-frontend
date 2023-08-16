import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { queryJobType } from "@/features/harvjob/harvjobSlice";
import { BackButton, Header } from "@/components/common";
import JobTypeList from "@/components/harvjob/jobtypes/JobTypeList";
import MainLayout from "@/components/layout/main";
import { HarvJobPagination } from "@/components/pagination";
import "./styles.css";

function JobTypeListView() {
  const { theme } = useAppSelector((state) => state.home);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(queryJobType({}));
  }, [dispatch]);

  return (
    <MainLayout>
      <div className="container">
        <Header title={"HDS JobTypes"} className={`display-6 mt-4 mb-4`} />
        <BackButton theme={theme} />
        <JobTypeList />
        <HarvJobPagination attr="jobtype" />
      </div>
    </MainLayout>
  );
}

export default JobTypeListView;
