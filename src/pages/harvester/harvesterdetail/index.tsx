import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import MainLayout from "@/components/layout/main";
import HarvesterDetail from "@/components/harvester/HarvesterDetail";
import { getHarvester } from "@/features/harvester/harvesterSlice";
import { Header, Loader } from "@/components/common";
import { LoaderDiv } from "@/components/styled";
import { queryErrorReport } from "@/features/errorreport/errorreportSlice";
import "./styles.css";

function HarvesterDetailView() {
  const { loading, harvester } = useAppSelector((state) => state.harvester);
  const dispatch = useAppDispatch();
  const { harvId } = useParams();

  useEffect(() => {
    (async () => {
      const res = await dispatch(getHarvester(Number(harvId)));
      await dispatch(queryErrorReport({ harv_ids: [res.payload?.harv_id] }));
    })();
  }, [dispatch, harvId]);

  return (
    <MainLayout>
      <div className="container">
        <Header
          title={"HDS Harvester"}
          className={"display-6 mt-4 mb-4"}
          id={String(harvester?.harv_id)}
        />
        {loading ? (
          <LoaderDiv>
            <Loader size={50} />
          </LoaderDiv>
        ) : (
          <HarvesterDetail />
        )}
      </div>
    </MainLayout>
  );
}

export default HarvesterDetailView;
