import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { getMigrationLog } from "@/features/migration/migrationSlice";
import { Header } from "@/components/common";
import MainLayout from "@/components/layout/main";
import MigrationDetail from "@/components/migration/MigrationDetail";
import { BackButton, Loader } from "@/components/common";
import { LoaderDiv } from "@/components/styled";
import "./styles.css";

function MigrationDetailView() {
  const { loading } = useAppSelector((state) => state.migration);
  const { theme } = useAppSelector((state) => state.home);
  const dispatch = useAppDispatch();
  const { migrationId } = useParams();

  useEffect(() => {
    dispatch(getMigrationLog(Number(migrationId)));
  }, [migrationId, dispatch]);

  return (
    <MainLayout>
      <div className="container">
        <Header
          title={"HDS Migration Log"}
          className={"display-6 mt-4 mb-4"}
          id={migrationId}
        />
        <BackButton mb="mb-4" theme={theme} />
        {loading ? (
          <LoaderDiv>
            <Loader size={50} />
          </LoaderDiv>
        ) : (
          <MigrationDetail />
        )}
      </div>
    </MainLayout>
  );
}

export default MigrationDetailView;
