import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAppDispatch } from "@/app/hooks";
import MainLayout from "@/components/layout/main";
import { Header } from "@/components/common";
import { queryHarvesterHistory } from "@/features/harvester/harvesterSlice";
import HarvesterHistoryList from "@/components/harvester/HarvesterHistoryList";
import { paramsToObject } from "@/utils/utils";
import { HarvesterPagination } from "@/components/pagination";
import "./styles.css";

function HarvesterHistoryListView() {
  const dispatch = useAppDispatch();
  const { search } = useLocation();

  useEffect(() => {
    const paramsObj = paramsToObject(search);
    dispatch(queryHarvesterHistory(paramsObj));
  }, [dispatch, search]);

  return (
    <MainLayout>
      <div className="container">
        <Header
          title={"HDS Harvesters History"}
          className={"display-6 mt-4 mb-4"}
        />

        <HarvesterHistoryList />
        <HarvesterPagination attr="harvesterhistory" />
      </div>
    </MainLayout>
  );
}

export default HarvesterHistoryListView;
