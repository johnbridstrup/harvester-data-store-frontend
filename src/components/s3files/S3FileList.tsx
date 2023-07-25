import moment from "moment";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Theme, toast } from "react-toastify";
import { useAppSelector, useAppDispatch } from "@/app/hooks";
import { LoaderDiv } from "@/components/styled";
import { darkThemeClass } from "@/utils/utils";
import { handleDownload } from "@/components/common";
import ConfirmModal from "@/components/modals/ConfirmModal";
import { deleteS3File, queryS3File } from "@/features/s3file/s3fileSlice";
import { FULLFILLED_PROMISE, THEME_MODES } from "@/features/base/constants";
import { Loader } from "../common";
import { S3File } from "@/features/s3file/s3fileTypes";

function S3FileList() {
  const { s3files, loading, flagging } = useAppSelector(
    (state) => state.s3file,
  );
  const { theme } = useAppSelector((state) => state.home);
  const [fileObj, setFileObj] = useState<S3File | null | undefined>(null);
  const confirmRef = useRef<HTMLButtonElement>(null);
  const dispatch = useAppDispatch();
  const tabledt = darkThemeClass("dt-table", theme);
  const download = (obj: { file: string }) => handleDownload({ url: obj.file });

  const markDeleted = (obj?: S3File | null) => {
    confirmRef.current?.click();
    setFileObj(obj);
  };

  const handleS3FileDelete = async () => {
    const res = await dispatch(deleteS3File(Number(fileObj?.id)));
    if (res.type === FULLFILLED_PROMISE.s3file) {
      dispatch(queryS3File({ deleted: false }));
      toast.success("s3file marked as deleted", {
        theme: theme === THEME_MODES.AUTO_THEME ? "colored" : (theme as Theme),
      });
      markDeleted();
    } else {
      toast.error("could not mark file as deleted", {
        theme: theme === THEME_MODES.AUTO_THEME ? "colored" : (theme as Theme),
      });
    }
  };

  return (
    <>
      {loading ? (
        <LoaderDiv>
          <Loader size={50} />
        </LoaderDiv>
      ) : (
        <div className="table-responsive">
          <table className={`table ${tabledt}`}>
            <thead>
              <tr>
                <th>Deleted</th>
                <th>ID</th>
                <th>Name</th>
                <th>File Type</th>
                <th>Download</th>
                <th>Event</th>
                <th>Mark Deleted</th>
                <th>Created At</th>
                <th>Updated At</th>
              </tr>
            </thead>
            <tbody>
              {s3files.map((obj, _) => (
                <tr key={obj.id}>
                  <td>
                    <input
                      className="form-check-input"
                      disabled
                      type="checkbox"
                      checked={obj.deleted}
                    />
                  </td>
                  <td>
                    {obj.deleted ? (
                      <span>{obj.id}</span>
                    ) : (
                      <Link to={`/s3files/${obj.id}`}>{obj.id}</Link>
                    )}
                  </td>
                  <td>{obj.key}</td>
                  <td>{obj.filetype}</td>
                  <td>
                    <span onClick={() => download(obj)} className="cursor">
                      <i className="las la-cloud-download-alt la-2x"></i>
                    </span>
                  </td>
                  <td>
                    <Link to={`/events/${obj.event.id}`}>{obj.event.UUID}</Link>
                  </td>
                  <td>
                    <span onClick={() => markDeleted(obj)}>
                      <i className="las la-trash-alt la-2x"></i>
                    </span>
                  </td>
                  <td>{moment(obj.created).format("LLLL")}</td>
                  <td>{moment(obj.lastModified).format("LLLL")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <ConfirmModal
        cancelRequest={markDeleted}
        confirmRef={confirmRef}
        confirmRequest={handleS3FileDelete}
        loading={flagging}
        msg={"Are you sure you want to mark this file(s) as deleted?"}
        theme={theme}
      />
    </>
  );
}

S3FileList.propTypes = {};

export default S3FileList;
