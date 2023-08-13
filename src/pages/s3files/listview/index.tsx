import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAppDispatch } from "@/app/hooks";
import { Header } from "@/components/common";
import MainLayout from "@/components/layout/main";
import { S3FilePagination } from "@/components/pagination";
import S3FileList from "@/components/s3files/S3FileList";
import S3FileQuery from "@/components/s3files/S3FileQuery";
import { queryS3File } from "@/features/s3file/s3fileSlice";
import { getEventTags } from "@/features/event/eventSlice";
import { paramsToObject } from "@/utils/utils";
import "./styles.css";

function S3FileListView() {
  const dispatch = useAppDispatch();
  const { search } = useLocation();
  const paramsObj = paramsToObject(search);

  useEffect(() => {
    dispatch(queryS3File({ deleted: false, ...paramsObj }));
    dispatch(getEventTags());
  }, [dispatch, paramsObj]);

  return (
    <MainLayout>
      <div className="container">
        <Header title={"HDS S3Files"} className={"display-6 mt-4 mb-4"} />
        <S3FileQuery />
        <S3FileList />
        <S3FilePagination />
      </div>
    </MainLayout>
  );
}

S3FileListView.propTypes = {};

export default S3FileListView;
