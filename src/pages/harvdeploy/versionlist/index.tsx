import { useEffect } from "react";
import { useAppDispatch } from "@/app/hooks";
import { queryVersion } from "@/features/harvdeploy/harvdeploySlice";
import MainLayout from "@/components/layout/main";
import { Header } from "@/components/common";
import VersionReportList from "@/components/harvdeploy/VersionReportList";
import { HDPagination } from "@/components/pagination";
import "./styles.css";

function VersionReportListView() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(queryVersion({}));
  }, [dispatch]);

  return (
    <MainLayout>
      <div className="container">
        <Header
          title={"HDS Harvester Version Report"}
          className={"display-6 mt-4 mb-4"}
        />
        <VersionReportList />
        <HDPagination attr="version" />
      </div>
    </MainLayout>
  );
}

export default VersionReportListView;
