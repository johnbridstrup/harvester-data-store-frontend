import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import MainLayout from "@/components/layout/main";
import { queryJobSchema, queryJobType } from "@/features/harvjob/harvjobSlice";
import { MAX_LIMIT } from "@/features/base/constants";
import JobSchemaList from "@/components/harvjob/jobschemas/JobSchemaList";
import { Header, BackButton } from "@/components/common";
import { HarvJobPagination } from "@/components/pagination";
import "./styles.css";

function JobSchemaListView() {
  const { theme } = useAppSelector((state) => state.home);
  const dispatch = useAppDispatch();

  useEffect(() => {
    (async () => {
      await Promise.all([
        dispatch(queryJobType({ limit: MAX_LIMIT })),
        dispatch(queryJobSchema({})),
      ]);
    })();
  }, [dispatch]);

  return (
    <MainLayout>
      <div className="container">
        <Header title={"HDS Job Schemas"} className={`display-6 mt-4 mb-4`} />
        <BackButton theme={theme} />
        <JobSchemaList />
        <HarvJobPagination attr="jobschema" />
      </div>
    </MainLayout>
  );
}

export default JobSchemaListView;
