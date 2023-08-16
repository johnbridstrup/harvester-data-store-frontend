import { useEffect } from "react";
import { useAppDispatch } from "@/app/hooks";
import { Header } from "@/components/common";
import { queryMigrationLog } from "@/features/migration/migrationSlice";
import MainLayout from "@/components/layout/main";
import MigrationList from "@/components/migration/MigrationList";
import { MigrationPagination } from "@/components/pagination/";
import "./styles.css";

function MigrationListView() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(queryMigrationLog({}));
  }, [dispatch]);

  return (
    <MainLayout>
      <div className="container">
        <Header
          title={"HDS Migration Logs"}
          className={"display-6 mt-4 mb-4"}
        />
        <MigrationList />
        <MigrationPagination />
      </div>
    </MainLayout>
  );
}

export default MigrationListView;
