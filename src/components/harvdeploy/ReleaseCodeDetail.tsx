import moment from "moment";
import { useRef, useState } from "react";
import VSCodeEditor from "@monaco-editor/react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  darkThemeClass,
  handleSelectFactory,
  monacoOptions,
  transformHarvOptions,
} from "@/utils/utils";
import { queryHarvester } from "@/features/harvester/harvesterSlice";
import { HarvesterCodeRelease } from "@/features/harvdeploy/harvdeployTypes";
import { THEME_MODES } from "@/features/base/constants";
import { User } from "@/features/auth/authTypes";
import { HarvesterPagination } from "@/components/pagination";
import ScheduleModal from "../modals/ScheduleModal";
import { handleReleaseFormSubmit } from "./ReleaseCodeHelpers";
import ReleaseTags from "./ReleaseTags";

function ReleaseCodeDetail() {
  const [releaseObj, setReleaseObj] = useState<HarvesterCodeRelease | null>(
    null,
  );
  const [selectedHarvId, setSelectedHarvId] = useState<any>(null);
  const { harvrelease, tags, installed } = useAppSelector(
    (state) => state.harvdeploy,
  );
  const { harvesters } = useAppSelector((state) => state.harvester);
  const { user, token } = useAppSelector((state) => state.auth);
  const { theme } = useAppSelector((state) => state.home);
  const dispatch = useAppDispatch();
  const modalRef = useRef<HTMLButtonElement | null>(null);
  const harvOptions = transformHarvOptions(harvesters);

  const handleFormSubmit = handleReleaseFormSubmit(
    releaseObj,
    selectedHarvId,
    user as User,
    token as string,
    dispatch,
  );
  const handleSelect = handleSelectFactory(setSelectedHarvId);

  const modalPopUp = async (obj: HarvesterCodeRelease | null) => {
    setReleaseObj(obj);
    await dispatch(queryHarvester({ fruit__name: obj?.fruit?.name }));
    modalRef.current?.click();
  };

  const tabledt = darkThemeClass("dt-table", theme);
  const btn = darkThemeClass("btn-dark", theme);

  return (
    <>
      <div className="table-responsive">
        <table className={`table ${tabledt}`}>
          <thead>
            <tr>
              <td>Version</td>
              <td>Fruit</td>
              <td>Created At</td>
              <td>Updated At</td>
              <td>Schedule Deployment</td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{harvrelease?.version}</td>
              <td>{harvrelease?.fruit?.name}</td>
              <td>{moment(harvrelease?.created).format("LLLL")}</td>
              <td>{moment(harvrelease?.lastModified).format("LLLL")}</td>
              <td>
                <span
                  onClick={() => modalPopUp(harvrelease)}
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
            </tr>
          </tbody>
        </table>
      </div>
      <div className="row mb-4">
        <div className="col-md-8">
          <VSCodeEditor
            height="40vh"
            language="json"
            value={JSON.stringify(harvrelease?.release, null, 2)}
            theme={theme === THEME_MODES.DARK_THEME ? "vs-dark" : "light"}
            options={{ ...monacoOptions, readOnly: true } as any}
          />
        </div>
        <div className="col-md-4">
          <ReleaseTags release={harvrelease} combinedTags={tags} />
        </div>
      </div>
      <div className="row mb-4">
        <div className="col-md-8">
          <div className="f-w-600">Currently Installed Harvesters</div>
          <div className="table-responsive mb-2">
            <table className={`table ${tabledt}`}>
              <thead>
                <tr>
                  <td>ID</td>
                  <td>Name</td>
                  <td>HarvID</td>
                  <td>Fruit</td>
                  <td>Location</td>
                  <td>Emulator</td>
                  <td>ThingName</td>
                </tr>
              </thead>
              <tbody>
                {installed.map((harv, _) => (
                  <tr key={harv.id}>
                    <td>{harv.id}</td>
                    <td>
                      <Link to={`/harvesters/${harv.id}`}>{harv.name}</Link>
                    </td>
                    <td>{harv.harv_id}</td>
                    <td>{harv.fruit?.name}</td>
                    <td>{harv.location?.ranch}</td>
                    <td>{harv.is_emulator ? "True" : "False"}</td>
                    <td>{harv.thingName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <HarvesterPagination />
        </div>
      </div>
      <ScheduleModal
        handleSubmit={handleFormSubmit}
        harvOptions={harvOptions}
        selectedHarvId={selectedHarvId}
        handleHarvIdSelect={handleSelect}
        theme={theme as string}
      />
    </>
  );
}

export default ReleaseCodeDetail;
