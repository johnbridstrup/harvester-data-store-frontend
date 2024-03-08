import { useEffect, useState, useReducer } from "react";
import { useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  getAllPaginatedEmustat,
  getEmulatorstatTags,
} from "@/features/emulatorstat/emulatorstatSlice";
import {
  ActionTypesEnum,
  EmulatorStatReport,
  SeriesTrace,
  TraceObj,
} from "@/features/emulatorstat/emulatorstatTypes";
import { EMUSTAT_LIMIT } from "@/features/base/constants";
import {
  SelectChart,
  transformEmustatAggs,
  transformEmustatSeries,
} from "@/components/emulatorstats/EmulatorstatsHelpers";
import MainLayout from "@/components/layout/main";
import EmulatorstatsChart from "@/components/emulatorstats/EmulatorstatsChart";
import EmulatorstatsQuery from "@/components/emulatorstats/EmulatorstatsQuery";
import EmulatorstatsSeries from "@/components/emulatorstats/EmulatorstatsSeries";
import { Header, Loader, CustomBackButton } from "@/components/common";
import { LoaderDiv } from "@/components/styled";
import { CopyGenericURL } from "@/components/copytoclipboard";
import {
  handleSelectFactory,
  paramsToObject,
  uniqueValues,
} from "@/utils/utils";
import "./styles.css";

interface ComponentState {
  emustats: Array<EmulatorStatReport>;
  gripSuccessPercent: Array<TraceObj>;
  pickSuccessPercent: Array<TraceObj>;
  picksPerHour: Array<TraceObj>;
  thoroughnessPercent: Array<TraceObj>;
  gripSuccessSeries: Array<SeriesTrace>;
  pickSuccessSeries: Array<SeriesTrace>;
  picksPerHourSeries: Array<SeriesTrace>;
  thoroughnessSeries: Array<SeriesTrace>;
  dates: Array<string>;
}

interface ActionPayload {
  type: string;
  payload: any;
}

const initialState: ComponentState = {
  emustats: [],
  gripSuccessPercent: [],
  pickSuccessPercent: [],
  picksPerHour: [],
  thoroughnessPercent: [],
  gripSuccessSeries: [],
  pickSuccessSeries: [],
  picksPerHourSeries: [],
  thoroughnessSeries: [],
  dates: [],
};

function reducer(state: ComponentState, action: ActionPayload) {
  switch (action.type) {
    case ActionTypesEnum.ON_MOUNT:
      const aggs = transformEmustatAggs(action.payload);
      const series = transformEmustatSeries(action.payload);
      return {
        ...state,
        emustats: action.payload,
        gripSuccessPercent: aggs.gripSuccessPercent,
        pickSuccessPercent: aggs.pickSuccessPercent,
        picksPerHour: aggs.picksPerHour,
        thoroughnessPercent: aggs.thoroughnessPercent,
        gripSuccessSeries: series.gripSuccessPercent,
        pickSuccessSeries: series.pickSuccessPercent,
        picksPerHourSeries: series.picksPerHour,
        thoroughnessSeries: series.thoroughnessPercent,
        dates: uniqueValues("date", action.payload),
      };
    case ActionTypesEnum.ON_DATE_PICKED:
      const date = action.payload;
      const filtered = state.emustats.filter((x) => x.date === date);
      const emuseries = transformEmustatSeries(filtered);
      return {
        ...state,
        gripSuccessSeries: emuseries.gripSuccessPercent,
        pickSuccessSeries: emuseries.pickSuccessPercent,
        picksPerHourSeries: emuseries.picksPerHour,
        thoroughnessSeries: emuseries.thoroughnessPercent,
      };
    default:
      return state;
  }
}

function EmulatorstatsChartView() {
  const [selectedChart, setSelectedChart] = useState({
    value: "Default Chart",
    label: "Default Chart",
  });
  const [state, dispatchAction] = useReducer(reducer, initialState);
  const { emustats, loading } = useAppSelector((state) => state.emulatorstat);
  const { theme } = useAppSelector((state) => state.home);
  const dispatch = useAppDispatch();
  const { search } = useLocation();
  const chartOptions = [
    { label: "Default Chart", value: "Default Chart" },
    { label: "Time Series Chart", value: "Time Series Chart" },
  ];

  useEffect(() => {
    dispatch(
      getAllPaginatedEmustat({
        ...paramsToObject(search),
        limit: EMUSTAT_LIMIT,
      }),
    );
    dispatch(getEmulatorstatTags());
  }, [dispatch, search]);

  useEffect(() => {
    dispatchAction({ type: ActionTypesEnum.ON_MOUNT, payload: emustats });
  }, [emustats]);

  const handleChartSelect = handleSelectFactory(setSelectedChart);

  return (
    <MainLayout>
      <div className="container">
        <Header
          title={"HDS Emulator Stats Chart"}
          className={"display-6 mt-4 mb-4"}
        />
        <CustomBackButton
          routeTo="emustats"
          theme={theme as string}
          mb={"mb-4"}
          paramsObj={paramsToObject(search)}
        />
        <EmulatorstatsQuery view="chartview" />
        <SelectChart
          chartOptions={chartOptions}
          handleChartSelect={handleChartSelect}
          selectedChart={selectedChart}
          theme={theme as string}
        />

        {loading ? (
          <LoaderDiv>
            <Loader size={50} />
          </LoaderDiv>
        ) : (
          <>
            {selectedChart && selectedChart.value === "Time Series Chart" ? (
              <EmulatorstatsSeries
                gripSuccessPercent={state.gripSuccessSeries}
                pickSuccessPercent={state.pickSuccessSeries}
                picksPerHour={state.picksPerHourSeries}
                thoroughnessPercent={state.thoroughnessSeries}
                dates={state.dates}
                dispatchAction={dispatchAction}
              />
            ) : (
              <EmulatorstatsChart
                gripSuccessPercent={state.gripSuccessPercent}
                pickSuccessPercent={state.pickSuccessPercent}
                picksPerHour={state.picksPerHour}
                thoroughnessPercent={state.thoroughnessPercent}
              />
            )}
            <CopyGenericURL
              paramsObj={paramsToObject(search)}
              theme={theme as string}
              route="emucharts"
            />
          </>
        )}
      </div>
    </MainLayout>
  );
}

export default EmulatorstatsChartView;
