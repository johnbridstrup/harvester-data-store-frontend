import { useState, useEffect, useRef, ChangeEvent, FormEvent } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { useNavigate, useLocation } from "react-router-dom";
import { Theme, toast } from "react-toastify";
import {
  buildQueryObj,
  copiedUrl,
  getDateRange,
  handleSelectFactory,
  mapParamsObject,
  paramsToObject,
  pushState,
  transformCodeOptions,
  transformFruitOptions,
  transformHarvOptions,
  transformLocOptions,
  transformTzOptions,
  transformUserOptions,
  translateUserOptions,
  validateQueryObj,
} from "@/utils/utils";
import {
  cacheParamsObj,
  copyQueryUrl,
  queryErrorReport,
  timezoneUpdate,
} from "@/features/errorreport/errorreportSlice";
import { createNotification } from "@/features/notification/notificationSlice";
import { DivTotalReport } from "../styled";
import timezones from "@/utils/timezones";
import NotificationModal from "../modals/NotificationModal";
import { FormQuery, QueryObject } from "./ErrorHelpers";
import { HoverTabular } from "./ErrorHelpers";
import { PushStateEnum, SUCCESS, THEME_MODES } from "@/features/base/constants";

function ErrorReportQuery() {
  const [selectedHarvId, setSelectedHarvId] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedTimezone, setSelectedTimezone] = useState(null);
  const [selectedFruit, setSelectedFruit] = useState(null);
  const [selectedCode, setSelectedCode] = useState(null);
  const [selectedRecipient, setSelectedRecipient] = useState<any>(null);
  const { start_time, end_time } = getDateRange();
  const [fieldData, setFieldData] = useState<QueryObject>({
    start_time,
    end_time,
    start_hour: "",
    end_hour: "",
    traceback: "",
    generic: "",
    is_emulator: "0",
    handled: "",
    primary: false,
  });
  const {
    pagination: { count },
    internal: { hovered },
  } = useAppSelector((state) => state.errorreport);
  const { harvesters, fruits } = useAppSelector((state) => state.harvester);
  const { locations } = useAppSelector((state) => state.location);
  const { exceptioncodes } = useAppSelector((state) => state.exception);
  const { users } = useAppSelector((state) => state.user);
  const { theme } = useAppSelector((state) => state.home);
  const harvesterOptions = transformHarvOptions(harvesters);
  const locationOptions = transformLocOptions(locations);
  const timezoneOptions = transformTzOptions(timezones);
  const fruitOptions = transformFruitOptions(fruits);
  const codeOptions = transformCodeOptions(exceptioncodes);
  const usersOptions = transformUserOptions(users);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { search } = useLocation();
  const notifyRef = useRef<HTMLButtonElement | null>(null);

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
  }, [search, exceptioncodes]);

  const handleHarvestSelect = handleSelectFactory(setSelectedHarvId);
  const handleLocationSelect = handleSelectFactory(setSelectedLocation);
  const handleTimezoneSelect = (newValue: any) => {
    setSelectedTimezone(newValue);
    dispatch(timezoneUpdate(newValue.value));
  };
  const handleFruitSelect = handleSelectFactory(setSelectedFruit);
  const handleCodeSelect = handleSelectFactory(setSelectedCode);
  const handleRecipientSelect = handleSelectFactory(setSelectedRecipient);

  const handleFieldChange = (e: ChangeEvent<HTMLInputElement>) => {
    let name = e.target.name;
    let value = name === "primary" ? e.target.checked : e.target.value;
    setFieldData((current) => {
      return { ...current, [name]: value };
    });
  };

  const handleFormQuerySubmit = async (e: FormEvent) => {
    e.preventDefault();
    let queryObj = buildQueryObj(
      fieldData,
      selectedHarvId,
      selectedLocation,
      selectedTimezone,
      selectedFruit,
      selectedCode,
    );
    await dispatch(queryErrorReport(queryObj));
    dispatch(copyQueryUrl(copiedUrl(queryObj)));
    dispatch(cacheParamsObj(queryObj));
    pushState(queryObj);
  };

  const handleGenPareto = async () => {
    let queryObj = buildQueryObj(
      fieldData,
      selectedHarvId,
      selectedLocation,
      selectedTimezone,
      selectedFruit,
      selectedCode,
    );
    let params = new URLSearchParams(queryObj);
    pushState(queryObj, PushStateEnum.GENPARETO);
    let routeto = `/errorreports/view/pareto/?group_by=code__name&${params.toString()}`;
    navigate(routeto);
  };

  const handleModalPopUp = () => {
    notifyRef.current?.click();
  };

  const handleNotificationCreate = async () => {
    let queryObj = buildQueryObj(
      fieldData,
      selectedHarvId,
      selectedLocation,
      selectedTimezone,
      selectedFruit,
      selectedCode,
    );
    if (selectedRecipient && selectedRecipient.length > 0) {
      let recipients = translateUserOptions(selectedRecipient);
      let isValid = validateQueryObj(queryObj);
      if (!isValid) {
        toast.error(
          "You must include at least one query to create a notification",
          {
            theme:
              theme === THEME_MODES.AUTO_THEME ? "colored" : (theme as Theme),
          },
        );
      } else {
        queryObj["recipients"] = recipients;
        delete queryObj["start_time"];
        delete queryObj["end_time"];
        const res = await dispatch(createNotification(queryObj));
        if (res?.payload?.status === SUCCESS) {
          toast.success(res?.payload?.message, {
            theme:
              theme === THEME_MODES.AUTO_THEME ? "colored" : (theme as Theme),
          });
          handleModalPopUp();
        } else {
          toast.error(res?.payload, {
            theme:
              theme === THEME_MODES.AUTO_THEME ? "colored" : (theme as Theme),
          });
        }
      }
    }
  };

  const queryColClassName =
    hovered?.type === "CODE"
      ? "col-lg-6 col-md-6 col-sm-12"
      : "col-lg-9 col-md-8 col-sm-12";
  const hoverColClassName =
    hovered?.type === "CODE"
      ? "col-lg-6 col-md-6 col-sm-12"
      : "col-lg-3 col-md-4 col-sm-12";

  return (
    <>
      <div className="row">
        <div className={queryColClassName}>
          <div>
            <FormQuery
              codeOptions={codeOptions}
              fruitOptions={fruitOptions}
              fieldData={fieldData}
              handleFieldChange={handleFieldChange}
              handleCodeSelect={handleCodeSelect}
              handleFormQuerySubmit={handleFormQuerySubmit}
              handleFruitSelect={handleFruitSelect}
              handleGenPareto={handleGenPareto}
              handleHarvestSelect={handleHarvestSelect}
              handleLocationSelect={handleLocationSelect}
              handleModalPopUp={handleModalPopUp}
              handleTimezoneSelect={handleTimezoneSelect}
              harvesterOptions={harvesterOptions}
              locationOptions={locationOptions}
              notifyRef={notifyRef}
              selectedCode={selectedCode}
              selectedFruit={selectedFruit}
              selectedHarvId={selectedHarvId}
              selectedLocation={selectedLocation}
              selectedTimezone={selectedTimezone}
              timezoneOptions={timezoneOptions}
              theme={theme as string}
            />
          </div>
        </div>
        <div className={hoverColClassName}>
          <DivTotalReport className="total-report">
            <span>Total Report</span>
            <span>{count}</span>
          </DivTotalReport>
          <HoverTabular hoverObj={hovered} theme={theme as string} />
        </div>
      </div>
      <NotificationModal
        usersOptions={usersOptions}
        handleRecipientSelect={handleRecipientSelect}
        handleSubmit={handleNotificationCreate}
        selectedRecipient={selectedRecipient}
        theme={theme as string}
      />
    </>
  );
}

export default ErrorReportQuery;
