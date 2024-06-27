import { useEffect } from "react";
import { useAppDispatch } from "@/app/hooks";
import MainLayout from "@/components/layout/main";
import { Header } from "@/components/common";
import HarvesterSwInfoList from "@/components/harvesterswinfo/HarvesterSwInfoList";
import HarvesterSwInfoQuery from "@/components/harvesterswinfo/HarvesterSwInfoQuery";
import {
  queryHarvester,
  queryHarvesterSwInfo,
} from "@/features/harvester/harvesterSlice";
import { MAX_LIMIT } from "@/features/base/constants";
import { getDateRange } from "@/utils/utils";
import { SWInfoPagination } from "@/components/pagination";
import "./styles.css";

function HarvesterSwInfoListView() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const { start_time, end_time } = getDateRange(14);
    dispatch(queryHarvesterSwInfo({ limit: 100, start_time, end_time }));
    dispatch(queryHarvester({ limit: MAX_LIMIT }));
  }, [dispatch]);

  return (
    <MainLayout>
      <div className="container">
        <Header
          title="Software Deployed Version Tracking"
          className={"display-6 mt-4 mb-4"}
        />
        <HarvesterSwInfoQuery />
        <HarvesterSwInfoList />
        <SWInfoPagination />
      </div>
    </MainLayout>
  );
}

export default HarvesterSwInfoListView;
