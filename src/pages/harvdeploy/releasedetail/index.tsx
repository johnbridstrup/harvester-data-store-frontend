import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import ReleaseCodeDetail from "@/components/harvdeploy/ReleaseCodeDetail";
import { BackButton, Header, Loader } from "@/components/common";
import MainLayout from "@/components/layout/main";
import { LoaderDiv } from "@/components/styled";
import {
  getRelease,
  installedHarvesters,
  queryReleaseTags,
} from "@/features/harvdeploy/harvdeploySlice";
import "./styles.css";

function ReleaseCodeDetailView() {
  const { loading } = useAppSelector((state) => state.harvdeploy);
  const { theme } = useAppSelector((state) => state.home);
  const dispatch = useAppDispatch();
  const { releaseId } = useParams();
  useEffect(() => {
    (async () => {
      await Promise.all([
        dispatch(getRelease(Number(releaseId))),
        dispatch(installedHarvesters(Number(releaseId))),
        dispatch(queryReleaseTags()),
      ]);
    })();
  }, [releaseId, dispatch]);

  return (
    <MainLayout>
      <div className="container">
        <Header
          title={"HDS Harvester Release Codes"}
          className={"display-6 mt-4 mb-4"}
          id={releaseId}
        />
        <BackButton theme={theme} mb="mb-4" />

        {loading ? (
          <LoaderDiv>
            <Loader size={50} />
          </LoaderDiv>
        ) : (
          <ReleaseCodeDetail />
        )}
      </div>
    </MainLayout>
  );
}

export default ReleaseCodeDetailView;
