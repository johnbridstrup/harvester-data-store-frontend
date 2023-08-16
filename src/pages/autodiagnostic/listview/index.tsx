import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAppDispatch } from "@/app/hooks";
import { queryAutodiagReport } from "@/features/autodiagnostic/autodiagnosticSlice";
import { queryHarvester } from "@/features/harvester/harvesterSlice";
import { queryLocation } from "@/features/location/locationSlice";
import { MAX_LIMIT } from "@/features/base/constants";
import AutodiagList from "@/components/autodiagnostic/AutodiagList";
import AutodiagQuery from "@/components/autodiagnostic/AutodiagQuery";
import { Header } from "@/components/common";
import MainLayout from "@/components/layout/main";
import { AutodiagPagination } from "@/components/pagination";
import { paramsToObject } from "@/utils/utils";
import "./styles.css";

function AutodiagnosticListView() {
  const dispatch = useAppDispatch();
  const { search } = useLocation();

  useEffect(() => {
    (async () => {
      dispatch(queryAutodiagReport(paramsToObject(search)));
      await Promise.all([
        dispatch(queryHarvester({ limit: MAX_LIMIT })),
        dispatch(queryLocation({ limit: MAX_LIMIT })),
      ]);
    })();
  }, [dispatch, search]);

  return (
    <MainLayout>
      <div className="container">
        <Header
          title={"HDS Autodiagnostics Report"}
          className={"display-6 mt-4 mb-4"}
        />
        <AutodiagQuery />
        <AutodiagList />
        <AutodiagPagination />
      </div>
    </MainLayout>
  );
}

export default AutodiagnosticListView;
