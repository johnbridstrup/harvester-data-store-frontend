import {
  lazy,
  Suspense,
  useState,
  useEffect,
  useCallback,
  useMemo,
  ChangeEvent,
  FormEvent,
} from "react";
import { useLocation } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import { useAppSelector } from "@/app/hooks";
import {
  buildQueryObj,
  darkThemeClass,
  handleSelectFactory,
  mapParamsObject,
  paramsToObject,
  pushState,
  sortReduceParetos,
  transformCodeOptions,
  transformFruitOptions,
  transformHarvOptions,
  transformLocOptions,
  transformTzOptions,
} from "@/utils/utils";
import timezones from "@/utils/timezones";
import { PushStateEnum } from "@/features/base/constants";
import { LoaderDiv, SidePane } from "../styled";
import {
  ParetoForm,
  ParetoState,
  ParetoTabular,
  paretoApiService,
} from "./ErrorHelpers";
import { CopyBuildConfig } from "../copytoclipboard";
import { Loader } from "@/components/common";
const ParetoPlot = lazy(() => import("../plotly/ParetoPlot"));

function ErrorReportPareto() {
  const [open, setOpen] = useState(false);
  const [selectedAggregate, setSelectedAggregate] = useState<any>(null);
  const [paretoArr, setParetoArr] = useState<Array<ParetoState>>([]);
  const [selectedHarvId, setSelectedHarvId] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedTimezone, setSelectedTimezone] = useState(null);
  const [selectedFruit, setSelectedFruit] = useState(null);
  const [selectedCode, setSelectedCode] = useState(null);
  const [fieldData, setFieldData] = useState({
    start_time: "",
    end_time: "",
    traceback: "",
    generic: "",
    is_emulator: "0",
    handled: "",
    primary: false,
  });
  const [loading, setLoading] = useState(false);
  const { fruits } = useAppSelector((state) => state.harvester);
  const { locations } = useAppSelector((state) => state.location);
  const { exceptioncodes } = useAppSelector((state) => state.exception);
  const { theme } = useAppSelector((state) => state.home);
  const { token } = useAppSelector((state) => state.auth);
  const harvesterOptions = transformHarvOptions([]);
  const locationOptions = transformLocOptions(locations);
  const timezoneOptions = transformTzOptions(timezones);
  const fruitOptions = transformFruitOptions(fruits);
  const codeOptions = transformCodeOptions(exceptioncodes);
  const { search } = useLocation();
  const paramsObj = paramsToObject(search);
  const lg = useMediaQuery({ query: "(min-width: 1170px)" });
  const md = useMediaQuery({ query: "(min-width: 850px)" });

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
      setSelectedAggregate,
    );
  }, [search, exceptioncodes]);

  const memoizeSortReducePareto = useMemo(() => sortReduceParetos, []);

  const paretoApiReq = useCallback(
    async (aggregateObj: Record<string, any>) => {
      if (selectedAggregate && selectedAggregate.length > 0) {
        const groups = selectedAggregate.map((x: { value: string }) => x.value);
        await paretoApiService(
          groups,
          token as string,
          aggregateObj,
          setParetoArr,
          memoizeSortReducePareto,
        );
      }
    },
    [selectedAggregate, token, memoizeSortReducePareto],
  );

  const paretoApiReqMount = useCallback(
    async (aggregateObj: Record<string, any>) => {
      if (aggregateObj.group_by) {
        const groups = aggregateObj.group_by
          .split(",")
          .map((x: string) => {
            return { label: x, value: x };
          })
          .map((x: { value: string }) => x.value);
        await paretoApiService(
          groups,
          token as string,
          aggregateObj,
          setParetoArr,
          memoizeSortReducePareto,
        );
      }
    },
    [token, memoizeSortReducePareto],
  );

  useEffect(() => {
    const paramsObj = paramsToObject(search);
    paretoApiReqMount(paramsObj);
  }, [search, paretoApiReqMount]);

  const handleHarvestSelect = handleSelectFactory(setSelectedHarvId);
  const handleLocationSelect = handleSelectFactory(setSelectedLocation);
  const handleTimezoneSelect = handleSelectFactory(setSelectedTimezone);
  const handleFruitSelect = handleSelectFactory(setSelectedFruit);
  const handleCodeSelect = handleSelectFactory(setSelectedCode);
  const handleAggreSelect = handleSelectFactory(setSelectedAggregate);

  const handleFieldChange = (e: ChangeEvent<HTMLInputElement>) => {
    let name = e.target.name;
    let value = name === "primary" ? e.target.checked : e.target.value;
    setFieldData((current) => {
      return { ...current, [name]: value };
    });
  };

  const handleSideClick = () => {
    setOpen(!open);
  };

  const handleBuildPareto = async (e?: FormEvent) => {
    e?.preventDefault();
    let queryObj = buildQueryObj(
      fieldData,
      selectedHarvId,
      selectedLocation,
      selectedTimezone,
      selectedFruit,
      selectedCode,
    );
    if (selectedAggregate && selectedAggregate.length > 0) {
      queryObj["group_by"] = selectedAggregate
        .map((x: { value: string }) => x.value)
        .join(",");
    }
    if (fieldData.primary) {
      queryObj["primary"] = fieldData.primary;
    }
    pushState(queryObj, PushStateEnum.BUILDCHART);
    setLoading(true);
    await paretoApiReq(queryObj);
    setLoading(false);
  };

  const handleDeletePareto = (chart: ParetoState) => {
    let arr = paretoArr.slice();
    let index = arr.findIndex((x) => x.id === chart.id);
    arr.splice(index, 1);
    setParetoArr(arr);
  };

  const className =
    open && lg
      ? "col-md-6"
      : !open && lg
      ? "col-md-4"
      : open && md
      ? "col-md-12"
      : !open && md
      ? "col-md-6"
      : "col-md-12";

  const icon = darkThemeClass("dt-delete-icon", theme);
  const btn = darkThemeClass("btn-dark", theme);

  return (
    <div>
      <ParetoForm
        handleAggreSelect={handleAggreSelect}
        handleSubmit={handleBuildPareto}
        selectedAggregate={selectedAggregate}
        codeOptions={codeOptions}
        fieldData={fieldData}
        fruitOptions={fruitOptions}
        handleCodeSelect={handleCodeSelect}
        handleFieldChange={handleFieldChange}
        handleFruitSelect={handleFruitSelect}
        handleHarvestSelect={handleHarvestSelect}
        handleLocationSelect={handleLocationSelect}
        handleTimezoneSelect={handleTimezoneSelect}
        harvesterOptions={harvesterOptions}
        locationOptions={locationOptions}
        selectedCode={selectedCode}
        selectedFruit={selectedFruit}
        selectedHarvId={selectedHarvId}
        selectedLocation={selectedLocation}
        selectedTimezone={selectedTimezone}
        timezoneOptions={timezoneOptions}
        theme={theme as string}
      />
      <div className="mb-2">
        <span onClick={handleSideClick} className={`btn cursor ${btn}`}>
          {open ? "Hide" : "Show"} Parameters
        </span>
        <CopyBuildConfig
          paramsObj={paramsObj}
          paretoArr={paretoArr}
          theme={theme as string}
        />
      </div>
      <div className="sidenav">
        <SidePane open={open}>
          <div className="sidecontent">
            {open && (
              <ParetoTabular paramsObj={paramsObj} theme={theme as string} />
            )}
          </div>
        </SidePane>
      </div>
      {loading ? (
        <LoaderDiv>
          <Loader size={50}></Loader>
        </LoaderDiv>
      ) : (
        <div className={`row ${open ? "mainchart" : "minus-side"}`}>
          {paretoArr.map((obj, _) => (
            <div key={obj.id} className={`${className} plot-div`}>
              <Suspense
                fallback={
                  <LoaderDiv>
                    <Loader size={25} />
                  </LoaderDiv>
                }
              >
                <ParetoPlot
                  xlabels={obj.paretos.xlabels}
                  ydata={obj.paretos.ydata}
                  chart_title={obj.chart_title}
                  theme={theme as string}
                />
              </Suspense>
              <span
                onClick={() => handleDeletePareto(obj)}
                className={`delete-icon ${icon}`}
              >
                <i className="las la-times"></i>
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ErrorReportPareto;
