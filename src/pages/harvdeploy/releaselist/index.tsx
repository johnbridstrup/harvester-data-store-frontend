import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAppDispatch } from "@/app/hooks";
import ReleaseCodeList from "@/components/harvdeploy/ReleaseCodeList";
import ReleaseCodeQuery from "@/components/harvdeploy/ReleaseCodeQuery";
import { Header } from "@/components/common";
import MainLayout from "@/components/layout/main";
import { HDPagination } from "@/components/pagination";
import { MAX_LIMIT } from "@/features/base/constants";
import { queryFruit } from "@/features/harvester/harvesterSlice";
import {
  queryRelease,
  queryReleaseTags,
} from "@/features/harvdeploy/harvdeploySlice";
import { paramsToObject } from "@/utils/utils";
import "./styles.css";

function ReleaseCodeListView() {
  const dispatch = useAppDispatch();
  const { search } = useLocation();

  useEffect(() => {
    (async () => {
      dispatch(queryRelease(paramsToObject(search)));
      await Promise.all([
        dispatch(queryFruit({ limit: MAX_LIMIT })),
        dispatch(queryReleaseTags()),
      ]);
    })();
  }, [dispatch, search]);

  return (
    <MainLayout>
      <div className="container">
        <Header
          title={"HDS Harvester Release Codes"}
          className={"display-6 mt-4 mb-4"}
        />
        <ReleaseCodeQuery />
        <ReleaseCodeList />
        <HDPagination attr="release" />
      </div>
    </MainLayout>
  );
}

export default ReleaseCodeListView;
