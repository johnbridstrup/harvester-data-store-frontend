import moment from "moment";
import { Link } from "react-router-dom";
import { useAppSelector } from "@/app/hooks";
import { handleDownload, Loader } from "@/components/common";
import { LoaderDiv } from "@/components/styled";
import { darkThemeClass } from "@/utils/utils";

function EventDetail() {
  const { event, loading } = useAppSelector((state) => state.event);
  const { theme } = useAppSelector((state) => state.home);

  const handleDownloadFiles = async (fileObj: { url: string }) => {
    await handleDownload(fileObj);
  };

  const cardtheme = darkThemeClass("dt-card-theme", theme);

  return (
    <>
      {loading ? (
        <LoaderDiv>
          <Loader size={50} />
        </LoaderDiv>
      ) : (
        <div className={`card ${cardtheme}`}>
          <div className="card-body">
            <div className="row mb-4">
              <div className="col-md-4">
                <div>
                  <strong>UUID</strong>
                </div>
                <div>{event?.UUID}</div>
              </div>
              <div className="col-md-4">
                <div>
                  <strong>Related Objects</strong>
                </div>
                <div>
                  {event?.related_objects?.map((obj, index) => (
                    <Link to={obj.url} key={index}>
                      <span>{obj.object}</span>
                      <br />
                    </Link>
                  ))}
                </div>
              </div>
              <div className="col-md-4">
                <div>
                  <strong>Related Files</strong>
                </div>
                <div>
                  {event?.related_files?.map((obj, index) => (
                    <a
                      href="#!"
                      key={index}
                      onClick={() => handleDownloadFiles(obj)}
                    >
                      <span>{obj.filetype}</span>
                      <br />
                    </a>
                  ))}
                </div>
              </div>
            </div>
            <div className="row mb-4">
              <div className="col-md-4">
                <div>
                  <strong>Created At</strong>
                </div>
                <div>{moment(event?.created).format("LLLL")}</div>
              </div>
              <div className="col-md-4">
                <div>
                  <strong>Updated At</strong>
                </div>
                <div>{moment(event?.lastModified).format("LLLL")}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default EventDetail;
