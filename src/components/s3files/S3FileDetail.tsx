import moment from "moment";
import { Link } from "react-router-dom";
import { useAppSelector } from "@/app/hooks";
import { handleDownload } from "@/components/common";
import { darkThemeClass } from "@/utils/utils";

function S3FileDetail() {
  const { s3file } = useAppSelector((state) => state.s3file);
  const { theme } = useAppSelector((state) => state.home);
  const { token } = useAppSelector((state) => state.auth);
  const download = (fileUrl: string) =>
    handleDownload({ url: fileUrl }, token as string);
  const cardtheme = darkThemeClass("dt-card-theme", theme);

  return (
    <div className={`card ${cardtheme}`}>
      <div className="card-body">
        <div className="row mb-4">
          <div className="col-md-4">
            <div>
              <strong>ID</strong>
            </div>
            <div>{s3file?.id}</div>
          </div>
          <div className="col-md-4">
            <div>
              <strong>Name (key)</strong>
            </div>
            <div>{s3file?.key}</div>
          </div>
          <div className="col-md-4">
            <div>
              <strong>File Type</strong>
            </div>
            <div>{s3file?.filetype}</div>
          </div>
        </div>
        <div className="row mb-4">
          <div className="col-md-4">
            <div>
              <strong>Download</strong>
            </div>
            <div>
              <span
                onClick={() => download(s3file?.file as string)}
                className="cursor"
              >
                <i className="las la-cloud-download-alt la-2x"></i>
              </span>
            </div>
          </div>
          <div className="col-md-4">
            <div>
              <strong>Event</strong>
            </div>
            <div>
              <Link to={`/events/${s3file?.event?.id}`}>
                {s3file?.event?.UUID}
              </Link>
            </div>
          </div>
          <div className="col-md-4">
            <div>
              <strong>Marked As Deleted</strong>
            </div>
            <div>
              <input
                className="form-check-input"
                type="checkbox"
                disabled
                checked={s3file?.deleted}
              />
            </div>
          </div>
        </div>
        <div className="row mb-4">
          <div className="col-md-4">
            <div>
              <strong>Created At</strong>
            </div>
            <div>{moment(s3file?.created).format("LLLL")}</div>
          </div>
          <div className="col-md-4">
            <div>
              <strong>Updated At</strong>
            </div>
            <div>{moment(s3file?.lastModified).format("LLLL")}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default S3FileDetail;
