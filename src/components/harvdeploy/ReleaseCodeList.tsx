import moment from "moment";
import { ChangeEvent, FormEvent, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Theme, toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  queryReleaseTags,
  updateRelease,
} from "@/features/harvdeploy/harvdeploySlice";
import { SUCCESS, THEME_MODES } from "@/features/base/constants";
import { queryHarvester } from "@/features/harvester/harvesterSlice";
import { User } from "@/features/auth/authTypes";
import { handleReleaseFormSubmit } from "./ReleaseCodeHelpers";
import {
  darkThemeClass,
  handleSelectFactory,
  transformHarvOptions,
} from "@/utils/utils";
import ReleaseTagModal from "@/components/modals/ReleaseTagModal";
import ScheduleModal from "@/components/modals/ScheduleModal";
import { Loader } from "@/components/common";
import { LoaderDiv } from "@/components/styled";
import { HarvesterCodeReleaseArray } from "@/features/harvdeploy/harvdeployTypes";

function ReleaseCodeList() {
  const [releaseObj, setReleaseObj] = useState<any>(null);
  const [selectedRelease, setSelectedRelease] = useState<any>(null);
  const [selectedHarvId, setSelectedHarvId] = useState<any>(null);
  const [fieldData, setFieldData] = useState({
    tag: "",
  });
  const { harvreleases, loading } = useAppSelector((state) => state.harvdeploy);
  const { harvesters } = useAppSelector((state) => state.harvester);
  const { user, token } = useAppSelector((state) => state.auth);
  const { theme } = useAppSelector((state) => state.home);
  const dispatch = useAppDispatch();
  const modalRef = useRef<HTMLButtonElement | null>(null);
  const tagRef = useRef<HTMLButtonElement | null>(null);
  const harvOptions = transformHarvOptions(harvesters);

  const handleFormSubmit = handleReleaseFormSubmit(
    releaseObj,
    selectedHarvId,
    user as User,
    token as string,
    dispatch,
  );
  const handleSelect = handleSelectFactory(setSelectedHarvId);

  const handleFieldChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFieldData((current) => {
      return { ...current, [e.target.name]: e.target.value };
    });
  };

  const modalPopUp = async (obj: HarvesterCodeReleaseArray) => {
    setReleaseObj(obj);
    await dispatch(queryHarvester({ fruit__name: obj.fruit?.name }));
    modalRef.current?.click();
  };

  const tagPopup = (obj: HarvesterCodeReleaseArray) => {
    setSelectedRelease(obj);
    tagRef.current?.click();
  };

  const handleTagSubmit = async (e: FormEvent) => {
    e.preventDefault();

    let tags = fieldData.tag.split(/\s*,\s*/);
    tags = [...tags, ...selectedRelease?.tags];
    let uniqueTags = [...new Set(tags)];
    let data = {
      ...selectedRelease?.release,
      tags: uniqueTags,
      id: selectedRelease?.id,
    };
    const res = await dispatch(updateRelease(data));
    if (res.payload?.status === SUCCESS) {
      await dispatch(queryReleaseTags());
      toast.success(res.payload?.message, {
        theme: THEME_MODES.AUTO_THEME ? "colored" : (theme as Theme),
      });
      tagRef.current?.click();
      setFieldData((current) => {
        return { ...current, tag: "" };
      });
    } else {
      toast.error(res.payload, {
        theme: THEME_MODES.AUTO_THEME ? "colored" : (theme as Theme),
      });
    }
  };

  const tabledt = darkThemeClass("dt-table", theme);
  const btn = darkThemeClass("btn-dark", theme);

  return (
    <>
      <div className="table-responsive">
        {loading ? (
          <LoaderDiv>
            <Loader size={50} />
          </LoaderDiv>
        ) : (
          <table className={`table ${tabledt}`}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Version</th>
                <th>Fruit</th>
                <th>Created At</th>
                <th>Updated At</th>
                <th>Schedule Deployment</th>
                <th>Add Tags</th>
              </tr>
            </thead>
            <tbody>
              {harvreleases.map((obj, _) => (
                <tr key={obj.id}>
                  <td>{obj.id}</td>
                  <td>
                    <Link to={`/release/${obj.id}`}>{obj.version}</Link>
                  </td>
                  <td>{obj.release?.project}</td>
                  <td>{moment(obj.created).format("LLLL")}</td>
                  <td>{moment(obj.lastModified).format("LLLL")}</td>
                  <td>
                    <span
                      onClick={() => modalPopUp(obj)}
                      className={`btn btn-sm ${btn}`}
                    >
                      Schedule
                    </span>
                    <button
                      ref={modalRef}
                      type="button"
                      data-bs-toggle="modal"
                      data-bs-target="#scheduleModal"
                      style={{ display: "none" }}
                    >
                      Schedule
                    </button>
                  </td>
                  <td>
                    <span
                      onClick={() => tagPopup(obj)}
                      className={`btn btn-sm ${btn}`}
                    >
                      Add Tags
                    </span>
                    <button
                      ref={tagRef}
                      type="button"
                      data-bs-toggle="modal"
                      data-bs-target="#tagModal"
                      style={{ display: "none" }}
                    >
                      Add Tags
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <ScheduleModal
        handleSubmit={handleFormSubmit}
        harvOptions={harvOptions}
        selectedHarvId={selectedHarvId}
        handleHarvIdSelect={handleSelect}
        theme={theme as string}
      />
      <ReleaseTagModal
        handleChange={handleFieldChange}
        handleSubmit={handleTagSubmit}
        fieldData={fieldData}
        theme={theme as string}
      />
    </>
  );
}

export default ReleaseCodeList;
