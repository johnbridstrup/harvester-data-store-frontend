import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAppDispatch } from "@/app/hooks";
import {
  getEmulatorstatTags,
  queryEmulatorstat,
} from "@/features/emulatorstat/emulatorstatSlice";
import MainLayout from "@/components/layout/main";
import { Header } from "@/components/common";
import EmulatorstatsList from "@/components/emulatorstats/EmulatorstatsList";
import EmulatorstatsQuery from "@/components/emulatorstats/EmulatorstatsQuery";
import { EmulatorStatPagination } from "@/components/pagination";
import { paramsToObject } from "@/utils/utils";
import "./styles.css";

function EmulatorstatsListView() {
  const dispatch = useAppDispatch();
  const { search } = useLocation();

  useEffect(() => {
    dispatch(queryEmulatorstat(paramsToObject(search)));
    dispatch(getEmulatorstatTags());
  }, [dispatch, search]);

  return (
    <MainLayout>
      <div className="container">
        <Header
          title={"HDS Emulator Statistics"}
          className={"display-6 mt-4 mb-4"}
        />
        <EmulatorstatsQuery view="listview" />
        <EmulatorstatsList />
        <EmulatorStatPagination />
      </div>
    </MainLayout>
  );
}

export default EmulatorstatsListView;
