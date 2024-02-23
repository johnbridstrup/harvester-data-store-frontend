import moment from "moment";
import { MutableRefObject, FC, ChangeEvent, Suspense, lazy } from "react";
import Select from "react-select";
import validator from "@rjsf/validator-ajv8";
import { JobStatus } from "@/features/harvjob/harvjobTypes";
import { darkThemeClass, selectDarkStyles } from "@/utils/utils";
import { THEME_MODES } from "@/features/base/constants";
import { InputFormControl, LoaderDiv } from "@/components/styled";
import { Loader } from "@/components/common";
import {
  ClockedData,
  CrontabData,
  IntervalData,
  ScheduleCase,
  ScheduleStepForm,
  ScheduledJob,
  TargetCase,
} from "@/features/jobscheduler/jobschedulerTypes";
const Form = lazy(() => import("@rjsf/mui"));

interface HistoryProps {
  jobstatuses: Array<JobStatus>;
  theme: string;
}

interface GroupProps {
  popUp: () => void;
  downloadRef: MutableRefObject<HTMLButtonElement | null>;
  confirmRef: MutableRefObject<HTMLButtonElement | null>;
  confirmPopUp: () => void;
  theme: string;
}

interface StaticFormProps {
  fieldData: { max_runs: number };
  handleFieldChange: (e: ChangeEvent<HTMLInputElement>) => void;
  theme: string;
  scheduleCase: string;
  handleScheduleCase: (e: ChangeEvent<HTMLInputElement>) => void;
  intervalData: IntervalData;
  handleIntervalChange: (e: ChangeEvent<HTMLInputElement>) => void;
  selectedPeriod: any;
  periodOptions: { label: string; value: string }[];
  handlePeriodSelect: (arg0: any) => void;
  crontabData: CrontabData;
  handleCrontabChange: (e: ChangeEvent<HTMLInputElement>) => void;
  clockedData: ClockedData;
  handleClockedChange: (e: ChangeEvent<HTMLInputElement>) => void;
  targetCase: string;
  handleTargetCase: (e: ChangeEvent<HTMLInputElement>) => void;
  selectedRanch: any;
  ranchOptions: { label: string; value: string }[];
  handleRanchSelect: (arg0: any) => void;
  selectedHarv: any;
  harvesterOptions: { label: string; value: string }[];
  handleHarvSelect: (arg0: any) => void;
  selectedFruit: any;
  fruitOptions: { label: string; value: string }[];
  handleFruitSelect: (arg0: any) => void;
  fleet: boolean;
  handleFleetChange: (e: ChangeEvent<HTMLInputElement>) => void;
  takeSteps: (step: string) => void;
}

interface DynamicFormProps {
  schema: Record<string, any>;
  scheduledjob: ScheduledJob | null;
  handleScheduleJob: (args0: Record<string, any>) => Promise<void>;
  theme: string;
  takeSteps: (arg0: string) => void;
}

export const JobStatusHistory = (props: HistoryProps) => {
  const tabledt = darkThemeClass("dt-table", props.theme);
  return (
    <div className="table-responsive">
      <table className={`table ${tabledt}`}>
        <thead>
          <tr>
            <th>Status History</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {props.jobstatuses?.map((status, _) => (
            <tr key={status.history_id}>
              <td
                className={`${
                  status.jobstatus === "Success"
                    ? "text-success"
                    : status.jobstatus === "Pending"
                    ? "text-warning"
                    : "text-danger"
                } `}
              >
                {status.jobstatus}
              </td>
              <td>{moment(status.history_date).format("LLLL")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export const RightButtonGroup = (props: GroupProps) => {
  const btn = darkThemeClass("btn-dark", props.theme);
  return (
    <div className="flex-right mb-2">
      <span
        onClick={props.confirmPopUp}
        className={`btn btn-default mx-2 ${btn}`}
      >
        Reschedule
      </span>
      <span onClick={props.popUp} className={`btn btn-default mx-2 ${btn}`}>
        Get Files
      </span>
      <button
        ref={props.downloadRef}
        data-bs-toggle="modal"
        data-bs-target="#downloadModal"
        style={{ display: "none" }}
      >
        Get Files
      </button>
      <button
        ref={props.confirmRef}
        data-bs-toggle="modal"
        data-bs-target="#confirmModal"
        style={{ display: "none" }}
      >
        Reschedule
      </button>
    </div>
  );
};

export const StaticFormStep: FC<StaticFormProps> = ({
  fieldData,
  handleFieldChange,
  theme,
  scheduleCase,
  handleScheduleCase,
  intervalData,
  handleIntervalChange,
  selectedPeriod,
  periodOptions,
  handlePeriodSelect,
  crontabData,
  handleCrontabChange,
  clockedData,
  handleClockedChange,
  targetCase,
  handleTargetCase,
  selectedRanch,
  ranchOptions,
  handleRanchSelect,
  selectedHarv,
  harvesterOptions,
  handleHarvSelect,
  selectedFruit,
  fruitOptions,
  handleFruitSelect,
  fleet,
  handleFleetChange,
  takeSteps,
}) => {
  const customStyles = theme === THEME_MODES.DARK_THEME ? selectDarkStyles : {};
  return (
    <>
      <div>Schedule</div>
      <div className="mb-4">
        <div>
          <input
            className="form-check-input"
            type="radio"
            name="schedule"
            id={ScheduleCase.Interval}
            value={ScheduleCase.Interval}
            checked={scheduleCase === ScheduleCase.Interval}
            onChange={handleScheduleCase}
          />{" "}
          <label htmlFor={ScheduleCase.Interval}>Interval</label>
        </div>
        <div>
          <input
            className="form-check-input"
            type="radio"
            name="schedule"
            id={ScheduleCase.Crontab}
            value={ScheduleCase.Crontab}
            checked={scheduleCase === ScheduleCase.Crontab}
            onChange={handleScheduleCase}
          />{" "}
          <label htmlFor={ScheduleCase.Crontab}>Crontab</label>
        </div>
        <div>
          <input
            className="form-check-input"
            type="radio"
            name="schedule"
            id={ScheduleCase.Clocked}
            value={ScheduleCase.Clocked}
            checked={scheduleCase === ScheduleCase.Clocked}
            onChange={handleScheduleCase}
          />{" "}
          <label htmlFor={ScheduleCase.Clocked}>Clocked</label>
        </div>
      </div>
      {scheduleCase === ScheduleCase.Interval && (
        <div className="row mb-4">
          <div className="col">
            <div className="form-group">
              <label htmlFor="every">Every</label>
              <InputFormControl
                type="number"
                name="every"
                id="every"
                value={intervalData.every}
                onChange={handleIntervalChange}
                placeholder="Number of periods between execution."
                theme={theme}
              />
            </div>
            <div className="form-group">
              <label htmlFor="period">Period</label>
              <Select
                isClearable
                isSearchable
                inputId="period"
                value={selectedPeriod}
                options={periodOptions}
                onChange={handlePeriodSelect}
                className="multi-select-container"
                classNamePrefix="select"
                styles={customStyles}
                placeholder="Seconds/minutes/days/..."
              />
            </div>
          </div>
        </div>
      )}
      {scheduleCase === ScheduleCase.Crontab && (
        <div className="row mb-4">
          <div className="col">
            <div className="form-group">
              <label htmlFor="timezone">Timezone</label>
              <InputFormControl
                type="string"
                name="timezone"
                id="timezone"
                value={crontabData.timezone}
                onChange={handleCrontabChange}
                placeholder="Timezone to execute."
                theme={theme}
              />
            </div>
            <div className="form-group">
              <label htmlFor="minute">Minute</label>
              <InputFormControl
                type="string"
                name="minute"
                id="minute"
                value={crontabData.minute}
                onChange={handleCrontabChange}
                placeholder="Cron minutes to run. Use * for all"
                theme={theme}
              />
            </div>
            <div className="form-group">
              <label htmlFor="hour">Hour</label>
              <InputFormControl
                type="string"
                name="hour"
                id="hour"
                value={crontabData.hour}
                onChange={handleCrontabChange}
                placeholder="Cron hours to run. Use * for all."
                theme={theme}
              />
            </div>
            <div className="form-group">
              <label htmlFor="day_of_week">Day Of Week</label>
              <InputFormControl
                type="string"
                name="day_of_week"
                id="day_of_week"
                value={crontabData.day_of_week}
                onChange={handleCrontabChange}
                placeholder="Cron days of the week to run. Use * for all."
                theme={theme}
              />
            </div>
            <div className="form-group">
              <label htmlFor="day_of_month">Day Of Month</label>
              <InputFormControl
                type="string"
                name="day_of_month"
                id="day_of_month"
                value={crontabData.day_of_month}
                onChange={handleCrontabChange}
                placeholder="Cron days of the month to run. Use * for all."
                theme={theme}
              />
            </div>
            <div className="form-group">
              <label htmlFor="month_of_year">Month Of Year</label>
              <InputFormControl
                type="string"
                name="month_of_year"
                id="month_of_year"
                value={crontabData.month_of_year}
                onChange={handleCrontabChange}
                placeholder="Cron months of the year to run. Use * for all."
                theme={theme}
              />
            </div>
          </div>
        </div>
      )}
      {scheduleCase === ScheduleCase.Clocked && (
        <div className="row mb-4">
          <div className="col">
            <div className="form-group">
              <label htmlFor="clocked_time">Clocked Time</label>
              <InputFormControl
                type="datetime-local"
                name="clocked_time"
                id="clocked_time"
                value={clockedData.clocked_time}
                onChange={handleClockedChange}
                placeholder="date-time"
                theme={theme}
              />
            </div>
          </div>
        </div>
      )}
      <div className="row mb-3">
        <div className="col">
          <label htmlFor="max_runs">Max Runs</label>
          <InputFormControl
            type="number"
            name="max_runs"
            id="max_runs"
            value={fieldData.max_runs}
            onChange={handleFieldChange}
            theme={theme}
          />
        </div>
      </div>
      <div>Targets</div>
      <div className="mb-4">
        <div>
          <input
            className="form-check-input"
            type="radio"
            name="target"
            id={TargetCase.Ranch}
            value={TargetCase.Ranch}
            checked={targetCase === TargetCase.Ranch}
            onChange={handleTargetCase}
          />{" "}
          <label htmlFor={TargetCase.Ranch}>Ranch</label>
        </div>
        <div>
          <input
            className="form-check-input"
            type="radio"
            name="target"
            id={TargetCase.Fruit}
            value={TargetCase.Fruit}
            checked={targetCase === TargetCase.Fruit}
            onChange={handleTargetCase}
          />{" "}
          <label htmlFor={TargetCase.Fruit}>Fruit</label>
        </div>
        <div>
          <input
            className="form-check-input"
            type="radio"
            name="target"
            id={TargetCase.Harvester}
            value={TargetCase.Harvester}
            checked={targetCase === TargetCase.Harvester}
            onChange={handleTargetCase}
          />{" "}
          <label htmlFor={TargetCase.Harvester}>Harvesters</label>
        </div>
        <div>
          <input
            className="form-check-input"
            type="radio"
            name="target"
            id={TargetCase.Fleet}
            value={TargetCase.Fleet}
            onChange={handleTargetCase}
            checked={targetCase === TargetCase.Fleet}
          />{" "}
          <label htmlFor={TargetCase.Fleet}>Fleet</label>
        </div>
      </div>
      {targetCase === TargetCase.Ranch && (
        <div className="row mb-2">
          <div className="col">
            <div className="form-group">
              <label htmlFor="ranches">Ranches</label>
              <Select
                isClearable
                isSearchable
                isMulti
                inputId="ranches"
                value={selectedRanch}
                options={ranchOptions}
                onChange={handleRanchSelect}
                className="multi-select-container"
                classNamePrefix="select"
                styles={customStyles}
                placeholder="Ranch object primary keys"
              />
            </div>
          </div>
        </div>
      )}
      {targetCase === TargetCase.Harvester && (
        <div className="row mb-2">
          <div className="col">
            <div className="form-group">
              <label htmlFor="harvesters">Harvesters</label>
              <Select
                isClearable
                isSearchable
                isMulti
                inputId="harvesters"
                value={selectedHarv}
                options={harvesterOptions}
                onChange={handleHarvSelect}
                className="multi-select-container"
                classNamePrefix="select"
                styles={customStyles}
                placeholder="Harvester names"
              />
            </div>
          </div>
        </div>
      )}
      {targetCase === TargetCase.Fruit && (
        <div className="row mb-2">
          <div className="col">
            <div className="form-group mb-2">
              <label htmlFor="fruits">Fruits</label>
              <Select
                isClearable
                isSearchable
                isMulti
                inputId="fruits"
                value={selectedFruit}
                options={fruitOptions}
                onChange={handleFruitSelect}
                className="multi-select-container"
                classNamePrefix="select"
                styles={customStyles}
                placeholder="Fruit names"
              />
            </div>
          </div>
        </div>
      )}
      {targetCase === TargetCase.Fleet && (
        <div className="row mb-2">
          <div className="col">
            <div className="form-group">
              <input
                className="form-check-input"
                type="checkbox"
                name="fleet"
                id="fleet"
                checked={fleet}
                value={String(fleet)}
                onChange={handleFleetChange}
              />{" "}
              <label htmlFor="fleet">Send to all Harvesters</label>
            </div>
          </div>
        </div>
      )}
      <div className="text-center mb-4">
        <button
          onClick={() => takeSteps(ScheduleStepForm.DynamicForm)}
          className="btn btn-sm btn-primary"
        >
          Next (step 1/2)
        </button>
      </div>
    </>
  );
};

export const DynamicFormStep: FC<DynamicFormProps> = ({
  schema,
  scheduledjob,
  handleScheduleJob,
  theme,
  takeSteps,
}) => {
  const formTheme = darkThemeClass("form-dt-bg", theme);
  return (
    <div className="mb-4">
      <div className="row">
        <div className="col">
          <Suspense
            fallback={
              <LoaderDiv>
                <Loader size={25} />
              </LoaderDiv>
            }
          >
            <Form
              schema={schema}
              validator={validator}
              formData={scheduledjob?.job_def}
              onSubmit={(data) => handleScheduleJob(data)}
              onError={(errors) => console.log(errors)}
              className={formTheme}
            >
              <div className="flex-vh">
                <button
                  type="button"
                  onClick={() => takeSteps(ScheduleStepForm.StaticForm)}
                  className="btn btn-sm btn-primary"
                >
                  Go back (step 2/2)
                </button>
                <button type="submit" className="btn btn-sm btn-primary mx-2">
                  Schedule
                </button>
              </div>
            </Form>
          </Suspense>
        </div>
      </div>
    </div>
  );
};
