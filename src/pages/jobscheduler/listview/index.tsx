import { useEffect } from "react";
import { useAppDispatch } from "@/app/hooks";
import { queryScheduledJob } from "@/features/jobscheduler/jobschedulerSlice";
import MainLayout from "@/components/layout/main";
import ScheduledJobList from "@/components/jobscheduler/ScheduledJobList";
import { SJPagination } from "@/components/pagination";
import { Header } from "@/components/common";
import "./styles.css";

function ScheduledJobListView() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(queryScheduledJob({}));
  }, [dispatch]);

  return (
    <MainLayout>
      <div className="container">
        <Header title={"HDS Scheduled Job"} className={`display-6 mt-4 mb-4`} />
        <ScheduledJobList />
        <SJPagination />
      </div>
    </MainLayout>
  );
}

export default ScheduledJobListView;
