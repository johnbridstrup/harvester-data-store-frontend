import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { getVersion } from "@/features/harvdeploy/harvdeploySlice";
import MainLayout from "@/components/layout/main";
import VersionReportDetail from "@/components/harvdeploy/VersionReportDetail";
import { LoaderDiv } from "@/components/styled";
import { Header, Loader } from "@/components/common";
import "./styles.css";

function VersionReportDetailView() {
  const { loading } = useAppSelector((state) => state.harvdeploy);
  const dispatch = useAppDispatch();
  const { versionId } = useParams();

  useEffect(() => {
    dispatch(getVersion(Number(versionId)));
  }, [dispatch, versionId]);

  return (
    <MainLayout>
      <div className="container">
        <Header
          title={"HDS Harvester Version Report"}
          className={"display-6 mt-4 mb-4"}
          id={versionId}
        />

        {loading ? (
          <LoaderDiv>
            <Loader size={50} />
          </LoaderDiv>
        ) : (
          <VersionReportDetail />
        )}
      </div>
    </MainLayout>
  );
}

export default VersionReportDetailView;
