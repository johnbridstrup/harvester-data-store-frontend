import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { Header } from "@/components/common";
import MainLayout from "@/components/layout/main";
import { BackButton } from "@/components/common";
import { getPickSession } from "@/features/event/eventSlice";
import PickSessionDetail from "@/components/event/PickSessionDetail";
import "./styles.css";

function PickSessionDetailView() {
  const { theme } = useAppSelector((state) => state.home);
  const { picksessionId } = useParams();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getPickSession(Number(picksessionId)));
  }, [dispatch, picksessionId]);

  return (
    <MainLayout>
      <div className="container">
        <Header
          title={"HDS PickSession"}
          className={"display-6 mt-4 mb-4"}
          id={picksessionId}
        />
        <BackButton mb="mb-4" theme={theme} />
        <PickSessionDetail />
      </div>
    </MainLayout>
  );
}

export default PickSessionDetailView;
