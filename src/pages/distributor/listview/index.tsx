import { useEffect } from "react";
import { useAppDispatch } from "@/app/hooks";
import DistributorList from "@/components/distributor/DistributorList";
import { Header } from "@/components/common";
import MainLayout from "@/components/layout/main";
import { DistributorPagination } from "@/components/pagination";
import { queryDistributor } from "@/features/distributor/distributorSlice";
import "./styles.css";

function DistributorListView() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(queryDistributor({}));
  }, [dispatch]);

  return (
    <MainLayout>
      <div className="container">
        <Header title={"HDS Distributors"} className={"display-6 mt-4 mb-4"} />
        <DistributorList />
        <DistributorPagination />
      </div>
    </MainLayout>
  );
}

export default DistributorListView;
