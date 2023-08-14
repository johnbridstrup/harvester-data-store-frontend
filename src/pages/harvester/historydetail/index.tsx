import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import MainLayout from "@/components/layout/main";
import { Header, Loader } from "@/components/common";
import HarvesterHistoryDetail from "@/components/harvester/HarvesterHistoryDetail";
import { LoaderDiv } from "@/components/styled";
import { getHarvesterHistory } from "@/features/harvester/harvesterSlice";
import "./styles.css";

function HarvesterHistoryDetailView() {
  const { loading } = useAppSelector((state) => state.harvester);
  const { historyId } = useParams();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getHarvesterHistory(Number(historyId)));
  }, [dispatch, historyId]);
  return (
    <MainLayout>
      <div className="container">
        <Header
          title={"HDS Harvesters History"}
          className={"display-6 mt-4 mb-4"}
          id={historyId}
        />
        {loading ? (
          <LoaderDiv>
            <Loader size={50} />
          </LoaderDiv>
        ) : (
          <HarvesterHistoryDetail />
        )}
      </div>
    </MainLayout>
  );
}

export default HarvesterHistoryDetailView;
