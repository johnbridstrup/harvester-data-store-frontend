import { useEffect } from "react";
import { Header } from "@/components/common";
import { useAppDispatch } from "@/app/hooks";
import MainLayout from "@/components/layout/main";
import ListLocation from "@/components/location/LocationList";
import { LocationPagination } from "@/components/pagination";
import { MAX_LIMIT } from "@/features/base/constants";
import { queryDistributor } from "@/features/distributor/distributorSlice";
import { queryLocation } from "@/features/location/locationSlice";
import "./styles.css";

function LocationListView() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    (async () => {
      await Promise.all([
        dispatch(queryLocation({})),
        dispatch(queryDistributor({ limit: MAX_LIMIT })),
      ]);
    })();
  }, [dispatch]);

  return (
    <MainLayout>
      <div className="container">
        <Header title={"HDS Locations"} className={"display-6 mt-4 mb-4"} />
        <ListLocation />
        <LocationPagination />
      </div>
    </MainLayout>
  );
}

export default LocationListView;
