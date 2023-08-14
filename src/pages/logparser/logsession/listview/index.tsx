import { useEffect } from "react";
import { useAppDispatch } from "@/app/hooks";
import MainLayout from "@/components/layout/main";
import { Header } from "@/components/common";
import DropFileInput from "@/components/logparser/logsession/DropFileInput";
import LogSessionList from "@/components/logparser/logsession/LogSessionList";
import { queryLogSession } from "@/features/logparser/logparserSlice";
import { LogSessionPagination } from "@/components/pagination";
import "./styles.css";

function LogSessionListView() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(queryLogSession({}));
  }, [dispatch]);

  return (
    <MainLayout>
      <div className="container">
        <Header className={"display-4"} title={"LOG PARSER"} />
        <DropFileInput />
        <LogSessionList />
        <LogSessionPagination />
      </div>
    </MainLayout>
  );
}

export default LogSessionListView;
