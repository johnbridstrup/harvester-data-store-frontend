import { useEffect } from "react";
import { useAppDispatch } from "@/app/hooks";
import HarvesterList from "@/components/harvester/HarvesterList";
import { Header } from "@/components/common";
import MainLayout from "@/components/layout/main";
import { HarvesterPagination } from "@/components/pagination";
import { MAX_LIMIT } from "@/features/base/constants";
import {
  queryFruit,
  queryHarvester,
} from "@/features/harvester/harvesterSlice";
import { queryLocation } from "@/features/location/locationSlice";
import "./styles.css";

function HarvesterListView() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    (async () => {
      await Promise.all([
        dispatch(queryHarvester({})),
        dispatch(queryFruit({ limit: MAX_LIMIT })),
        dispatch(queryLocation({ limit: MAX_LIMIT })),
      ]);
    })();
  }, [dispatch]);

  return (
    <MainLayout>
      <div className="container">
        <Header title={"HDS Harvesters"} className={"display-6 mt-4 mb-4"} />
        <HarvesterList />
        <HarvesterPagination />
      </div>
    </MainLayout>
  );
}

export default HarvesterListView;
