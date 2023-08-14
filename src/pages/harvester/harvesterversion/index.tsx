import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import HarvesterVersionList from "@/components/harvester/HarvesterVersionList";
import { Header } from "@/components/common";
import MainLayout from "@/components/layout/main";
import { HarvesterPagination } from "@/components/pagination";
import {
  getHarvester,
  queryHarvesterVersion,
} from "@/features/harvester/harvesterSlice";
import "./styles.css";

function HarvesterVersionView() {
  const { harvester } = useAppSelector((state) => state.harvester);
  const { harvId } = useParams();
  const dispatch = useAppDispatch();

  useEffect(() => {
    (async () => {
      await Promise.all([
        dispatch(queryHarvesterVersion({ harvId })),
        dispatch(getHarvester(Number(harvId))),
      ]);
    })();
  }, [dispatch, harvId]);

  return (
    <MainLayout>
      <div className="container">
        <Header
          title={"HDS Harvester Version"}
          className={"display-6 mt-4 mb-4"}
          id={String(harvester?.harv_id)}
        />
        <HarvesterVersionList />
        <HarvesterPagination attr="harvesterversion" />
      </div>
    </MainLayout>
  );
}

export default HarvesterVersionView;
