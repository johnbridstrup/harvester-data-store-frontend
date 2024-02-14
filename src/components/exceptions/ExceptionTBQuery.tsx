import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Theme, toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { queryTBBreakdown } from "@/features/exception/exceptionSlice";
import {
  FULLFILLED_PROMISE,
  PushStateEnum,
  REJECTED_PROMISE,
  THEME_MODES,
} from "@/features/base/constants";
import {
  buildQueryObj,
  handleSelectFactory,
  mapParamsObject,
  paramsToObject,
  pushState,
  transformCodeOptions,
  transformFruitOptions,
  transformHarvOptions,
  transformLocOptions,
  transformTzOptions,
} from "@/utils/utils";
import {
  AdvancedQueryField,
  FormProps,
  GenericFormField,
  QueryObject,
} from "../errorreport/ErrorHelpers";
import timezones from "@/utils/timezones";
import { timezoneUpdate } from "@/features/errorreport/errorreportSlice";

function ExceptionTBQuery() {
  const [selectedHarvId, setSelectedHarvId] = useState<any>(null);
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [selectedTimezone, setSelectedTimezone] = useState<any>(null);
  const [selectedFruit, setSelectedFruit] = useState<any>(null);
  const [selectedCode, setSelectedCode] = useState<any>(null);
  const [fieldData, setFieldData] = useState<QueryObject>({
    start_time: "",
    end_time: "",
    start_hour: "",
    end_hour: "",
    traceback: "",
    generic: "",
    is_emulator: "0",
    handled: "",
    primary: false,
  });
  const [queryToggle, setQueryToggle] = useState(false);
  const { exceptioncodes, loading } = useAppSelector(
    (state) => state.exception,
  );
  const { harvesters, fruits } = useAppSelector((state) => state.harvester);
  const { locations } = useAppSelector((state) => state.location);
  const { theme } = useAppSelector((state) => state.home);
  const harvesterOptions = transformHarvOptions(harvesters);
  const locationOptions = transformLocOptions(locations);
  const timezoneOptions = transformTzOptions(timezones);
  const fruitOptions = transformFruitOptions(fruits);
  const codeOptions = transformCodeOptions(exceptioncodes);
  const handleHarvestSelect = handleSelectFactory(setSelectedHarvId);
  const handleLocationSelect = handleSelectFactory(setSelectedLocation);
  const handleTimezoneSelect = (newValue: any) => {
    setSelectedTimezone(newValue);
    dispatch(timezoneUpdate(newValue.value));
  };
  const handleFruitSelect = handleSelectFactory(setSelectedFruit);
  const handleCodeSelect = handleSelectFactory(setSelectedCode);
  const dispatch = useAppDispatch();
  const { search } = useLocation();

  useEffect(() => {
    const paramsObj = paramsToObject(search);
    mapParamsObject(
      paramsObj,
      exceptioncodes,
      setSelectedHarvId,
      setSelectedLocation,
      setSelectedFruit,
      setSelectedCode,
      setFieldData,
      setSelectedTimezone,
      () => {},
    );
    dispatch(queryTBBreakdown(paramsObj));
  }, [search, dispatch]);

  const handleFieldChange = (e: ChangeEvent<HTMLInputElement>) => {
    let name = e.target.name;
    let value = name === "primary" ? e.target.checked : e.target.value;
    setFieldData((current) => {
      return { ...current, [name]: value };
    });
  };

  const handleQuerySubmit = async (e: FormEvent) => {
    e.preventDefault();
    let queryObj = buildQueryObj(
      fieldData,
      selectedHarvId,
      selectedLocation,
      selectedTimezone,
      selectedFruit,
      selectedCode,
    );
    const res = await dispatch(queryTBBreakdown(queryObj));
    if (res.type === REJECTED_PROMISE.exception) {
      toast.error(res.payload, {
        theme: theme === THEME_MODES.AUTO_THEME ? "colored" : (theme as Theme),
      });
    } else if (res.type === FULLFILLED_PROMISE.exception) {
      pushState(queryObj, PushStateEnum.TRACEBACKBREAKDOWN);
    }
  };
  const props: FormProps = {
    harvesterOptions,
    handleHarvestSelect,
    selectedHarvId,
    locationOptions,
    handleLocationSelect,
    selectedLocation,
    fruitOptions,
    handleFruitSelect,
    selectedFruit,
    codeOptions,
    handleCodeSelect,
    selectedCode,
    fieldData,
    handleFieldChange,
    timezoneOptions,
    handleTimezoneSelect,
    selectedTimezone,
    theme: theme as string,
  };
  const handleQueryToggle = () => {
    setQueryToggle((current) => !current);
  };

  return (
    <div className="mt-4 mb-4">
      <form onSubmit={handleQuerySubmit} data-testid="query-form">
        <GenericFormField {...props} />
        <AdvancedQueryField
          fieldData={fieldData}
          handleFieldChange={handleFieldChange}
          handleQueryToggle={handleQueryToggle}
          queryToggle={queryToggle}
          theme={theme as string}
        />
        <div className="form-group text-center">
          <button type="submit" className="btn btn-primary">
            {loading ? "loading.." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ExceptionTBQuery;
