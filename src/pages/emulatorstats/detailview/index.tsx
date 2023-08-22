import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { getEmulatorstat } from "@/features/emulatorstat/emulatorstatSlice";
import MainLayout from "@/components/layout/main";
import { LoaderDiv } from "@/components/styled";
import EmulatorstatsDetail from "@/components/emulatorstats/EmulatorstatsDetail";
import { Header, Loader, BackButton } from "@/components/common";
import "./styles.css";

function EmulatorstatsDetailView() {
  const { loading } = useAppSelector((state) => state.emulatorstat);
  const { theme } = useAppSelector((state) => state.home);
  const dispatch = useAppDispatch();
  const { emustatsId } = useParams();

  useEffect(() => {
    dispatch(getEmulatorstat(Number(emustatsId)));
  }, [dispatch, emustatsId]);

  return (
    <MainLayout>
      <div className="container">
        <Header
          title={"HDS Emulator Statistics"}
          className={"display-6 mt-4 mb-4"}
          id={emustatsId}
        />
        <BackButton theme={theme} mb={"mb-4"} />

        {loading ? (
          <LoaderDiv>
            <Loader size={50} />
          </LoaderDiv>
        ) : (
          <EmulatorstatsDetail />
        )}
      </div>
    </MainLayout>
  );
}

export default EmulatorstatsDetailView;
