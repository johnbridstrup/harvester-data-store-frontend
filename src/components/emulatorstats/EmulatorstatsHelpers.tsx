import { DataFrame, toJSON } from "danfojs";
import moment from "moment";
import Select from "react-select";
import {
  darkThemeClass,
  groupByWeek,
  mapTraces,
  mergeSort,
  sortByMonth,
  selectDarkStyles,
} from "@/utils/utils";
import {
  EmulatorStatReport,
  ResultReport,
  TraceObj,
} from "@/features/emulatorstat/emulatorstatTypes";

interface ChartProps {
  chartOptions: any;
  handleChartSelect: (args0: any) => void;
  selectedChart: any;
  theme: string;
}

/**
 * Create and return a DataFrame
 * @param dateFunc
 * @param emustats
 * @returns
 */
export const createDataFrame = (
  dateFunc: Function,
  emustats: Array<EmulatorStatReport>,
) => {
  const df = new DataFrame(emustats);
  const num_picks_col = df
    .column("num_pick_attempts")
    .mul(df.column("pick_success_percentage").div(100))
    .asType("int32");
  const num_grips_col = df
    .column("num_grip_attempts")
    .mul(df.column("grip_success_percentage").div(100))
    .asType("int32");
  const num_targets_col = num_picks_col
    .div(df.column("thoroughness_percentage").div(100))
    .asType("int32");
  const elapsed_hours_col = df.column("elapsed_seconds").div(3600);
  const report_time_col = df.column("reportTime").map((val) => dateFunc(val));

  df.addColumn("num_picks", num_picks_col, { inplace: true });
  df.addColumn("num_grips", num_grips_col, { inplace: true });
  df.addColumn("num_targets", num_targets_col, { inplace: true });
  df.addColumn("elapsed_hours", elapsed_hours_col, { inplace: true });
  df.addColumn("reportTime", report_time_col, { inplace: true });

  const picks_col = df.column("num_picks").div(df.column("elapsed_hours"));
  df.addColumn("picks_per_hour", picks_col, { inplace: true });

  return df;
};

/**
 * Transforms emustats api data using danfo.js pandas'
 * like data structure and return the aggregates
 * This function needs to be in the component to avoid the test
 * module error experienced in all modules.
 * TypeError: _danfojs.DataFrame is not a constructor
 * @param emustats
 * @returns
 */
export const transformEmustatAggs = (emustats: Array<EmulatorStatReport>) => {
  let picksPerHour: Array<TraceObj> = [];
  let thoroughnessPercent: Array<TraceObj> = [];
  let gripSuccessPercent: Array<TraceObj> = [];
  let pickSuccessPercent: Array<TraceObj> = [];

  const weekStr = (dateStr: string, weekStart: number = 3) => {
    let mom = moment(dateStr);
    let dayOfWeekMod = (mom.day() + (7 - weekStart)) % 7;

    const grpDate = mom.subtract(dayOfWeekMod, "days");
    return grpDate.format("YYYY-MM-DD");
  };

  if (emustats.length > 0) {
    let df = createDataFrame(weekStr, emustats);

    df = df.groupby(["reportTime", "date"]).agg({
      num_picks: "sum",
      num_grips: "sum",
      num_targets: "sum",
      elapsed_hours: "sum",
      num_pick_attempts: "sum",
      num_grip_attempts: "sum",
      pick_success_percentage: "std",
      grip_success_percentage: "std",
      thoroughness_percentage: "std",
      picks_per_hour: "std",
    });

    const picks_per_hour = df
      .column("num_picks_sum")
      .div(df.column("elapsed_hours_sum"));
    const thoroughness = df
      .column("num_picks_sum")
      .div(df.column("num_targets_sum"))
      .mul(100);
    const grip_success = df
      .column("num_picks_sum")
      .div(df.column("num_grip_attempts_sum"))
      .mul(100);
    const pick_success = df
      .column("num_picks_sum")
      .div(df.column("num_pick_attempts_sum"))
      .mul(100);

    df.addColumn("picks_per_hour", picks_per_hour, { inplace: true });
    df.addColumn("thoroughness", thoroughness, { inplace: true });
    df.addColumn("grip_success", grip_success, { inplace: true });
    df.addColumn("pick_success", pick_success, { inplace: true });

    const results = toJSON(df) as Array<ResultReport>;
    sortByMonth(results);
    const resultObj = groupByWeek(results);
    picksPerHour = mergeSort(mapTraces("picks_per_hour", resultObj));
    thoroughnessPercent = mergeSort(mapTraces("thoroughness", resultObj));
    gripSuccessPercent = mergeSort(mapTraces("grip_success", resultObj));
    pickSuccessPercent = mergeSort(mapTraces("pick_success", resultObj));
  }
  return {
    picksPerHour,
    thoroughnessPercent,
    gripSuccessPercent,
    pickSuccessPercent,
  };
};

/**
 * Transforms emustats api data using danfo.js pandas'
 * like data structure and return the aggregates
 * @param emustats
 * @returns
 */
export const transformEmustatSeries = (emustats: Array<EmulatorStatReport>) => {
  let picksPerHour: Array<number> = [];
  let thoroughnessPercent: Array<number> = [];
  let gripSuccessPercent: Array<number> = [];
  let pickSuccessPercent: Array<number> = [];
  let timeSeries: Array<string> = [];
  let hoverInfo: Array<string> = [];

  const dateString = (dateStr: string) =>
    moment(dateStr).format("YYYY-MM-DD h:mm:ss");

  if (emustats.length > 0) {
    let df = createDataFrame(dateString, emustats);

    const picks_per_hour = df
      .column("num_picks")
      .div(df.column("elapsed_hours"));
    const thoroughness = df
      .column("num_picks")
      .div(df.column("num_targets"))
      .mul(100);
    const grip_success = df
      .column("num_picks")
      .div(df.column("num_grip_attempts"))
      .mul(100);
    const pick_success = df
      .column("num_picks")
      .div(df.column("num_pick_attempts"))
      .mul(100);

    df.addColumn("picks_per_hour", picks_per_hour, { inplace: true });
    df.addColumn("thoroughness", thoroughness, { inplace: true });
    df.addColumn("grip_success", grip_success, { inplace: true });
    df.addColumn("pick_success", pick_success, { inplace: true });

    const results = toJSON(df) as Array<ResultReport>;
    picksPerHour = results.map((x) => x.picks_per_hour);
    thoroughnessPercent = results.map((x) => x.thoroughness);
    gripSuccessPercent = results.map((x) => x.grip_success);
    pickSuccessPercent = results.map((x) => x.pick_success);
    timeSeries = results.map((x) => x.reportTime);
    hoverInfo = results.map((x) => x.tags?.join(", ")) as Array<string>;
  }
  return {
    picksPerHour,
    thoroughnessPercent,
    gripSuccessPercent,
    pickSuccessPercent,
    timeSeries,
    hoverInfo,
  };
};

export const SelectChart = (props: ChartProps) => {
  const dark = darkThemeClass("dark-theme", props.theme);
  const customStyles = dark ? selectDarkStyles : {};
  return (
    <div className="mb-4">
      <label htmlFor="chart">Select Chart Type From Dropdown</label>
      <Select
        isSearchable
        options={props.chartOptions}
        name="chart"
        inputId="chart"
        onChange={props.handleChartSelect}
        value={props.selectedChart}
        defaultValue={props.selectedChart}
        className="multi-select-container"
        classNamePrefix="select"
        styles={customStyles}
      />
    </div>
  );
};
