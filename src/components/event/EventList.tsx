import { useAppSelector } from "@/app/hooks";
import { handleDownload, Loader } from "@/components/common";
import { LoaderDiv } from "../styled";
import { GenericEvent } from "./EventHelpers";

function EventList() {
  const { events, loading } = useAppSelector((state) => state.event);
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
          data={events}
          link="events"
          theme={theme as string}
          handleDownload={handleDownloadFiles}
        />
      )}
    </>
  );
}

export default EventList;
