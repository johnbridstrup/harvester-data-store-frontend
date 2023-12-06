import { useAppSelector } from "@/app/hooks";
import { LoaderDiv } from "@/components/styled";
import { handleDownload, Loader } from "@/components/common";
import { GenericEvent } from "./EventHelpers";

function PickSessionList() {
  const { picksessions, loading } = useAppSelector((state) => state.event);
  const { theme } = useAppSelector((state) => state.home);
  const { token } = useAppSelector((state) => state.auth);

  const handleDownloadFiles = async (fileObj: { url: string }) => {
    await handleDownload(fileObj, token as string);
  };

  return (
    <>
      {loading ? (
        <LoaderDiv>
          <Loader size={50} />
        </LoaderDiv>
      ) : (
        <GenericEvent
          data={picksessions}
          handleDownload={handleDownloadFiles}
          link="picksessions"
          theme={theme as string}
        />
      )}
    </>
  );
}

export default PickSessionList;
