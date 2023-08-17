import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Select from "react-select";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { queryAutodiagReport } from "@/features/autodiagnostic/autodiagnosticSlice";
import { PushStateEnum, THEME_MODES } from "@/features/base/constants";
import { InputFormControl } from "@/components/styled";
import {
  extractDateFromString,
  handleSelectFactory,
  paramsToObject,
  pushState,
  selectDarkStyles,
  timeStampFormat,
  transformHarvOptions,
  transformLocOptions,
} from "@/utils/utils";

interface QueryData {
  uuid: string;
  robot: string;
  gripper_sn: string;
  result: string;
  start_time: string;
  end_time: string;
}

function AutodiagQuery() {
  const [selectedHarvId, setSelectHarvId] = useState<any>(null);
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [fieldData, setFieldData] = useState<QueryData>({
    uuid: "",
    robot: "",
    gripper_sn: "",
    result: "",
    start_time: "",
    end_time: "",
  });
  const { theme } = useAppSelector((state) => state.home);
  const { harvesters } = useAppSelector((state) => state.harvester);
  const { locations } = useAppSelector((state) => state.location);
  const dispatch = useAppDispatch();
  const { search } = useLocation();
  const harvesterOptions = transformHarvOptions(harvesters);
  const locationOptions = transformLocOptions(locations);
  const handleFieldChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFieldData((current) => {
      return { ...current, [e.target.name]: e.target.value };
    });
  };
  const handleHarvestSelect = handleSelectFactory(setSelectHarvId);
  const handleLocationSelect = handleSelectFactory(setSelectedLocation);
  const customStyles = theme === THEME_MODES.DARK_THEME ? selectDarkStyles : {};

  useEffect(() => {
    const paramsObj = paramsToObject(search);
    if (paramsObj.harv_id) {
      let harv_id = { label: paramsObj.harv_id, value: paramsObj.harv_id };
      setSelectHarvId(harv_id);
    }
    if (paramsObj.ranch) {
      let ranch = { label: paramsObj.ranch, value: paramsObj.ranch };
      setSelectedLocation(ranch);
    }
    if (paramsObj.uuid) {
      setFieldData((current) => {
        return { ...current, uuid: paramsObj.uuid };
      });
    }
    if (paramsObj.gripper_sn) {
      setFieldData((current) => {
        return { ...current, gripper_sn: paramsObj.gripper_sn };
      });
    }
    if (paramsObj.robot) {
      setFieldData((current) => {
        return { ...current, robot: paramsObj.robot };
      });
    }
    if (paramsObj.result) {
      setFieldData((current) => {
        return { ...current, result: paramsObj.result };
      });
    }
    if (paramsObj.start_time) {
      setFieldData((current) => {
        return { ...current, start_time: paramsObj.start_time };
      });
    }
    if (paramsObj.end_time) {
      setFieldData((current) => {
        return { ...current, end_time: paramsObj.end_time };
      });
    }
  }, [search]);

  const buildQueryObj = () => {
    let queryObj: Record<string, any> = {};
    if (selectedHarvId && selectedHarvId.hasOwnProperty("value")) {
      queryObj["harv_id"] = selectedHarvId.value;
    }
    if (selectedLocation && selectedLocation.hasOwnProperty("value")) {
      queryObj["ranch"] = selectedLocation.value;
    }
    if (fieldData.uuid) {
      queryObj["uuid"] = fieldData.uuid;
    }
    if (fieldData.gripper_sn) {
      queryObj["gripper_sn"] = fieldData.gripper_sn;
    }
    if (fieldData.robot) {
      queryObj["robot"] = fieldData.robot;
    }
    if (fieldData.result) {
      queryObj["result"] = fieldData.result;
    }
    if (fieldData.start_time) {
      queryObj["start_time"] = timeStampFormat(
        extractDateFromString(fieldData.start_time),
      );
    }
    if (fieldData.end_time) {
      queryObj["end_time"] = timeStampFormat(
        extractDateFromString(fieldData.end_time),
      );
    }
    return queryObj;
  };

  const handleQuerySubmit = async (e: FormEvent) => {
    e.preventDefault();
    let queryObj = buildQueryObj();
    dispatch(queryAutodiagReport(queryObj));
    pushState(queryObj, PushStateEnum.AUTODIAGNOSTICS);
  };

  return (
    <div className="mt-4 mb-4">
      <form onSubmit={handleQuerySubmit} data-testid="query-form">
        <div className="row mb-2">
          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="harv_ids">Harv IDS</label>
              <Select
                isSearchable
                isClearable
                placeholder="1,2,3,..."
                options={harvesterOptions}
                name="harv_ids"
                inputId="harv_ids"
                onChange={handleHarvestSelect}
                value={selectedHarvId}
                defaultValue={selectedHarvId}
                className="multi-select-container"
                classNamePrefix="select"
                styles={customStyles}
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="locations">Ranches</label>
              <Select
                isSearchable
                isClearable
                placeholder="ranch1, ranch2, ..."
                options={locationOptions}
                name="locations"
                inputId="locations"
                onChange={handleLocationSelect}
                defaultValue={selectedLocation}
                value={selectedLocation}
                className="multi-select-container"
                classNamePrefix="select"
                styles={customStyles}
              />
            </div>
          </div>
        </div>
        <div className="row mb-2">
          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="uuid">UUID</label>
              <InputFormControl
                type="text"
                name="uuid"
                id="uuid"
                value={fieldData.uuid}
                theme={theme}
                onChange={handleFieldChange}
                placeholder="77f6a03c-24c9-11ed-bb17-f9799c718175"
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="robot">Robot</label>
              <InputFormControl
                type="number"
                name="robot"
                id="robot"
                value={fieldData.robot}
                theme={theme}
                onChange={handleFieldChange}
                placeholder="0"
              />
            </div>
          </div>
        </div>
        <div className="row mb-2">
          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="gripper_sn">Gripper SN</label>
              <InputFormControl
                type="number"
                name="gripper_sn"
                id="gripper_sn"
                value={fieldData.gripper_sn}
                theme={theme}
                onChange={handleFieldChange}
                placeholder="1277"
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-check">
              <label htmlFor="result_1">Result Success</label>
              <input
                type="radio"
                name="result"
                value="1"
                id="result_1"
                checked={fieldData.result === "1"}
                onChange={handleFieldChange}
                className="form-check-input"
              />
            </div>
            <div className="form-check">
              <label htmlFor="result_0">Result Failed</label>
              <input
                type="radio"
                name="result"
                value="0"
                id="result_0"
                checked={fieldData.result === "0"}
                onChange={handleFieldChange}
                className="form-check-input"
              />
            </div>
          </div>
        </div>
        <div className="row mb-4">
          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="start_time">Start Time</label>
              <InputFormControl
                type="text"
                name="start_time"
                id="start_time"
                value={fieldData.start_time}
                onChange={handleFieldChange}
                placeholder="YYYYMMDDHHmmSS"
                theme={theme}
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="end_time">End Time</label>
              <InputFormControl
                type="text"
                name="end_time"
                id="end_time"
                value={fieldData.end_time}
                onChange={handleFieldChange}
                placeholder="YYYYMMDDHHmmSS"
                theme={theme}
              />
            </div>
          </div>
        </div>
        <div className="form-group text-center">
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

export default AutodiagQuery;
