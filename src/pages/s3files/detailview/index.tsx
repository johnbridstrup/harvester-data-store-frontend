import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { getS3File } from "@/features/s3file/s3fileSlice";
import { Header } from "@/components/common";
import MainLayout from "@/components/layout/main";
import S3FileDetail from "@/components/s3files/S3FileDetail";
import { BackButton, Loader } from "@/components/common";
import { LoaderDiv } from "@/components/styled";
import "./styles.css";

function S3FileDetailView() {
  const { loading } = useAppSelector((state) => state.s3file);
  const { theme } = useAppSelector((state) => state.home);
  const { s3fileId } = useParams();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getS3File(Number(s3fileId)));
  }, [s3fileId, dispatch]);

  return (
    <MainLayout>
      <div className="container">
        <Header
          title={"HDS S3Files"}
          className={"display-6 mt-4 mb-4"}
          id={s3fileId}
        />
        <BackButton mb={"mb-4"} theme={theme} />
        {loading ? (
          <LoaderDiv>
            <Loader size={50} />
          </LoaderDiv>
        ) : (
          <S3FileDetail />
        )}
      </div>
    </MainLayout>
  );
}

export default S3FileDetailView;
