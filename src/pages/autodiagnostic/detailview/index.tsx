import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { getAutodiagReport } from "@/features/autodiagnostic/autodiagnosticSlice";
import AutodiagDetail from "@/components/autodiagnostic/AutodiagDetail";
import {
  Header,
  Loader,
  BackButton,
  DownloadButton,
  handleDownload,
} from "@/components/common";
import MainLayout from "@/components/layout/main";
import { LoaderDiv } from "@/components/styled";
import { timeStampFormat } from "@/utils/utils";
import DownloadModal from "@/components/modals/DownloadModal";
import "./styles.css";

function AutodiagnosticDetailView() {
  const { loading, report } = useAppSelector((state) => state.autodiagnostic);
  const { timezone } = useAppSelector((state) => state.errorreport);
  const { theme } = useAppSelector((state) => state.home);
  const { token } = useAppSelector((state) => state.auth);
  const { reportId } = useParams();
  const dispatch = useAppDispatch();
  const downloadRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    dispatch(getAutodiagReport(Number(reportId)));
  }, [reportId, dispatch]);

  const modalPopUp = () => {
    downloadRef.current?.click();
  };

  const download = (fileObj: { url: string }) =>
    handleDownload(fileObj, token as string);

  return (
    <MainLayout>
      <div className="container">
        <Header
          title={`Autodiagnostics: Harv ${report?.harvester
            ?.harv_id} Robot ${report?.robot} (${timeStampFormat(
            new Date(report?.reportTime as string),
            timezone as string,
          )})`}
          className={"display-6 mt-4 mb-4"}
        />
        <BackButton theme={theme} mb={"mb-4"} />
        <DownloadButton
          downloadRef={downloadRef}
          popUp={modalPopUp}
          theme={theme as string}
        />
        {loading ? (
          <LoaderDiv>
            <Loader size={50} />
          </LoaderDiv>
        ) : (
          <AutodiagDetail />
        )}
        <DownloadModal
          eventObj={report?.event}
          theme={theme as string}
          handleDownload={download}
        />
      </div>
    </MainLayout>
  );
}

export default AutodiagnosticDetailView;
