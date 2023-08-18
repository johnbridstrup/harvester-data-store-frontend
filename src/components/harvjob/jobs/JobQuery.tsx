import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Select from "react-select";
import { useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { queryJob } from "@/features/harvjob/harvjobSlice";
import { PushStateEnum, THEME_MODES } from "@/features/base/constants";
import {
  transformHarvOptions,
  statusOptions,
  selectDarkStyles,
  pushState,
  paramsToObject,
  handleSelectFactory,
} from "@/utils/utils";
import { InputFormControl } from "@/components/styled";

function JobQuery() {
  const [fieldData, setFieldData] = useState<{ uuid: string }>({
    uuid: "",
  });
  const [selectedHarvId, setSelectedHarvId] = useState<any>(null);
  const [selectedStatus, setSelectedStatus] = useState<any>(null);
  const { harvesters } = useAppSelector((state) => state.harvester);
  const { theme } = useAppSelector((state) => state.home);
  const harvesterOptions = transformHarvOptions(harvesters);
  const dispatch = useAppDispatch();
  const { search } = useLocation();

  useEffect(() => {
    const paramsObj = paramsToObject(search);
    if (paramsObj.event__UUID) {
      setFieldData((current) => {
        return { ...current, uuid: paramsObj.event__UUID };
      });
    }
    if (paramsObj.target__harv_id) {
      let harv_id = {
        label: paramsObj.target__harv_id,
        value: paramsObj.target__harv_id,
      };
      setSelectedHarvId(harv_id);
    }
    if (paramsObj.jobstatus) {
      let jobstatus = {
        label: paramsObj.jobstatus,
        value: paramsObj.jobstatus,
      };
      setSelectedStatus(jobstatus);
    }
  }, [search]);

  const handleFieldChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFieldData((current) => {
      return { ...current, [e.target.name]: e.target.value };
    });
  };

  const handleHarvestSelect = handleSelectFactory(setSelectedHarvId);
  const handleStatusSelect = handleSelectFactory(setSelectedStatus);

  const handleFormQuerySubmit = async (e: FormEvent) => {
    e.preventDefault();
    const queryObj: Record<string, any> = {};

    if (fieldData.uuid) {
      queryObj["event__UUID"] = fieldData.uuid;
    }
    if (selectedHarvId && selectedHarvId.hasOwnProperty("value")) {
      queryObj["target__harv_id"] = selectedHarvId.value;
    }
    if (selectedStatus && selectedStatus.hasOwnProperty("value")) {
      queryObj["jobstatus"] = selectedStatus.value;
    }

    dispatch(queryJob(queryObj));
    pushState(queryObj, PushStateEnum.JOBS);
  };

  const customStyles = theme === THEME_MODES.DARK_THEME ? selectDarkStyles : {};

  return (
    <form onSubmit={handleFormQuerySubmit} data-testid="query-form">
      <div className="row mb-4">
        <div className="col">
          <div className="form-group">
            <label htmlFor="uuid">UUID</label>
            <InputFormControl
              type="text"
              name="uuid"
              id="uuid"
              theme={theme}
              value={fieldData.uuid}
              onChange={handleFieldChange}
              placeholder="ee402ab2-5627-11ed-ab3a-75f85fa65d8d"
            />
          </div>
        </div>
      </div>
      <div className="row mb-4">
        <div className="col">
          <div className="form-group">
            <label htmlFor="harv_id">Harv ID</label>
            <Select
              isSearchable
              isClearable
              placeholder="11"
              options={harvesterOptions}
              name="harv_id"
              inputId="harv_id"
              onChange={handleHarvestSelect}
              defaultValue={selectedHarvId}
              value={selectedHarvId}
              className="multi-select-container"
              classNamePrefix="select"
              styles={customStyles}
            />
          </div>
        </div>
      </div>
      <div className="row mb-4">
        <div className="col">
          <div className="form-group">
            <label htmlFor="jobstatus">Job Status</label>
            <Select
              isSearchable
              isClearable
              placeholder="Success"
              options={statusOptions}
              name="jobstatus"
              inputId="jobstatus"
              onChange={handleStatusSelect}
              defaultValue={selectedStatus}
              value={selectedStatus}
              className="multi-select-container"
              classNamePrefix="select"
              styles={customStyles}
            />
          </div>
        </div>
      </div>
      <div className="mb-4">
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </div>
    </form>
  );
}

export default JobQuery;
