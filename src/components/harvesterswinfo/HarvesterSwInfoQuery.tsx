import { ChangeEvent, FormEvent, useState } from "react";
import Select from "react-select";
import { useAppSelector, useAppDispatch } from "@/app/hooks";
import { queryHarvesterSwInfo } from "@/features/harvester/harvesterSlice";
import { PushStateEnum } from "@/features/base/constants";
import {
  darkThemeClass,
  extractDateFromString,
  handleSelectFactory,
  pushState,
  selectDarkStyles,
  timeStampFormat,
  transformHarvOptions,
} from "@/utils/utils";
import { InputFormControl } from "../styled";

interface FieldData {
  start_time: string;
  end_time: string;
}

function HarvesterSwInfoQuery() {
  const [fieldData, setFieldData] = useState<FieldData>({
    start_time: "",
    end_time: "",
  });
  const [selectedHarvId, setSelectedHarvId] = useState<any>(null);
  const { harvesters } = useAppSelector((state) => state.harvester);
  const { theme } = useAppSelector((state) => state.home);
  const dispatch = useAppDispatch();
  const harvesterOptions = transformHarvOptions(harvesters);

  const handleFieldChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFieldData((current) => {
      return { ...current, [e.target.name]: e.target.value };
    });
  };

  const buildQueryObj = () => {
    const queryObj: Record<string, any> = {};
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
    if (selectedHarvId && selectedHarvId.hasOwnProperty("value")) {
      queryObj["harv_id"] = selectedHarvId.value;
    }
    return queryObj;
  };

  const handleFormQuerySubmit = async (e: FormEvent) => {
    e.preventDefault();
    dispatch(queryHarvesterSwInfo(buildQueryObj()));
    pushState(buildQueryObj(), PushStateEnum.HARVESTERSWINFO);
  };

  const handleHarvestSelect = handleSelectFactory(setSelectedHarvId);
  const dark = darkThemeClass("dark-theme", theme);
  const customStyles = dark ? selectDarkStyles : {};

  return (
    <form
      onSubmit={handleFormQuerySubmit}
      className="mb-4"
      data-testid="query-form"
    >
      <div className="row mb-4">
        <div className="col">
          <div className="form-group">
            <label htmlFor="harv_ids">Harvesters</label>
            <Select
              isSearchable
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
      <div className="text-center mt-3">
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </div>
    </form>
  );
}

export default HarvesterSwInfoQuery;
