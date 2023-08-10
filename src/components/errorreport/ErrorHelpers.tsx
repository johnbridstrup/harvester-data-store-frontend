import {
  ChangeEvent,
  FormEvent,
  MutableRefObject,
  useRef,
  useState,
} from "react";
import Select from "react-select";
import useClickOutside from "@/hooks/useClickOutside";
import {
  aggregateOptions,
  darkThemeClass,
  imagePath,
  selectDarkStyles,
} from "@/utils/utils";
import { InputFormControl } from "../styled";

export interface ParamsString {
  harv_ids?: string;
  locations?: string;
  fruits?: string;
  codes?: string;
  traceback?: string;
  start_time?: string;
  end_time?: string;
  tz?: string;
  generic?: string;
  is_emulator?: string;
  handled?: string;
  primary?: string;
  group_by?: string;
}

export interface QueryObject {
  harv_ids?: Array<number>;
  locations?: Array<string>;
  fruits?: Array<string>;
  codes?: Array<number>;
  traceback?: string;
  start_time?: string;
  end_time?: string;
  tz?: string;
  generic?: string;
  is_emulator?: string;
  handled?: string;
  primary?: boolean;
  recipients?: Array<number>;
}

export interface FormProps {
  handleFormQuerySubmit?: (e: FormEvent) => void;
  harvesterOptions: any;
  handleHarvestSelect: (arg0: any) => void;
  selectedHarvId: any;
  locationOptions: any;
  handleLocationSelect: (arg0: any) => void;
  selectedLocation: any;
  fruitOptions: any;
  handleFruitSelect: (arg0: any) => void;
  selectedFruit: any;
  codeOptions: any;
  handleCodeSelect: (arg0: any) => void;
  selectedCode: any;
  timezoneOptions: any;
  handleTimezoneSelect: (arg0: any) => void;
  selectedTimezone: any;
  handleGenPareto?: () => void;
  handleModalPopUp?: () => void;
  notifyRef?: MutableRefObject<HTMLButtonElement | null>;
  fieldData: QueryObject;
  handleFieldChange: (e: ChangeEvent<HTMLInputElement>) => void;
  usersOptions?: any;
  handleRecipientSelect?: (args0: any) => void;
  selectedRecipient?: any;
  handleSubmit?: (e?: FormEvent) => Promise<void>;
  theme: string;
}

interface LabelProps {
  htmlFor: string;
  labelText: string;
  model?: string;
  attr?: string;
  content: string;
  example: string;
  open: boolean;
  toggleOpen: (label: string) => void;
  labelRef: MutableRefObject<HTMLDivElement | null>;
  field: string;
  extras?: { code: string; info: string };
  theme: string;
}

interface LabelBool {
  harv: boolean;
  ranch: boolean;
  fruit: boolean;
  code: boolean;
  traceback: boolean;
  generic: boolean;
}

interface HoverProps {
  hoverObj: { type: string; obj: Record<string, any> } | null;
  theme: string;
}

interface TabularProps {
  exceptName: string;
  timestamp: string;
  theme: string;
}

interface GroupProps {
  popUp: () => void;
  downloadRef: MutableRefObject<HTMLButtonElement | null>;
  createNotifRef: MutableRefObject<HTMLButtonElement | null>;
  createNotifPopUp: () => void;
  theme: string;
}

export interface ParetoProps extends FormProps {
  handleAggreSelect: (args0: any) => void;
  selectedAggregate: any;
}

interface ParetoTabProps {
  paramsObj: Record<string, any>;
  theme: string;
}

export const HoverTabular = (props: HoverProps) => {
  const bg = darkThemeClass("bg-dark", props.theme);
  const style = bg
    ? { border: "1px solid #ccc" }
    : { background: "#f4f4f4", border: "1px solid #ccc" };
  return (
    <>
      {props.hoverObj?.type === "HARVESTER" && (
        <div>
          <div className="d-flex">
            <div className={`tabular bg-gray ${bg}`}>Property</div>
            <div className={`tabular bg-gray ${bg}`}>Value</div>
          </div>
          <div className="d-flex">
            <div className="tabular">Harv ID</div>
            <div className="tabular">{props.hoverObj?.obj?.harv_id}</div>
          </div>
          <div className="d-flex">
            <div className="tabular">Name</div>
            <div className="tabular">{props.hoverObj?.obj?.name}</div>
          </div>
          <div className="d-flex">
            <div className="tabular">Fruit</div>
            <div className="tabular">{props.hoverObj?.obj?.fruit?.name}</div>
          </div>
          <div className="d-flex">
            <div className="tabular">Location</div>
            <div className="tabular">
              {props.hoverObj?.obj?.location?.ranch}
            </div>
          </div>
        </div>
      )}

      {props.hoverObj?.type === "LOCATION" && (
        <div>
          <div className="d-flex">
            <div className={`tabular bg-gray ${bg}`}>Property</div>
            <div className={`tabular bg-gray ${bg}`}>Value</div>
          </div>
          <div className="d-flex">
            <div className="tabular">Ranch</div>
            <div className="tabular">{props.hoverObj?.obj?.ranch}</div>
          </div>
          <div className="d-flex">
            <div className="tabular">Country</div>
            <div className="tabular">{props.hoverObj?.obj?.country}</div>
          </div>
          <div className="d-flex">
            <div className="tabular">Region</div>
            <div className="tabular">{props.hoverObj?.obj?.region}</div>
          </div>
          <div className="d-flex">
            <div className="tabular">Location</div>
            <div className="tabular">
              {props.hoverObj?.obj?.distributor?.name}
            </div>
          </div>
        </div>
      )}

      {props.hoverObj?.type === "CODE" && (
        <div className="table-responsive">
          <table className={`table ${bg && "dt-table"}`}>
            <thead>
              <tr>
                <th style={style}>Code</th>
                <th style={style}>Exception</th>
                <th style={style}>Service</th>
              </tr>
            </thead>
            <tbody>
              {props.hoverObj?.obj?.map(
                (obj: {
                  code: { code: number; name: string };
                  id: number;
                  service: string;
                  robot: number;
                }) => (
                  <tr key={obj.id}>
                    <td>{obj.code?.code}</td>
                    <td>{obj.code?.name}</td>
                    <td>
                      {obj.service}.{obj.robot}
                    </td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </div>
      )}
      <small>
        ** <b>Note</b> If you hover over (harvester) (location) and (code).
        Extra information will appear here **
      </small>
    </>
  );
};

export const GenericLabel = ({
  htmlFor,
  field,
  labelRef,
  labelText,
  toggleOpen,
  open,
  model,
  attr,
  content,
  example,
  extras,
  theme,
}: LabelProps) => {
  const labelTheme = darkThemeClass("bg-dark", theme);

  return (
    <label
      htmlFor={htmlFor}
      className={`label-docs ${
        (field === "harv" || field === "ranch") && open ? "mt-open" : ""
      }`}
    >
      {labelText}{" "}
      <span className="label-img" onClick={() => toggleOpen(field)}>
        <img src={imagePath("quest")} alt="" />
      </span>
      {open && (
        <>
          <div className={`help-text scrollbar ${labelTheme}`} ref={labelRef}>
            <span className="help-text-header">
              {model} <code style={{ color: "#242526" }}>{attr}</code>
            </span>
            <span className="help-text-content">
              {content}{" "}
              {field === "generic"
                ? "Example query would be something like "
                : "e.g"}{" "}
              <code>{example}</code>{" "}
              {extras ? (
                <span>
                  {extras.info}
                  <code>{extras.code}</code>
                </span>
              ) : (
                "e.t.c.."
              )}
            </span>
            <a href="/docs" className="help-text-content">
              View docs
            </a>
          </div>
          <div className="help-arrow-down"></div>
        </>
      )}
    </label>
  );
};

export const GenericFormField = (props: FormProps) => {
  const {
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
    theme,
  } = props;
  const dark = darkThemeClass("dark-theme", theme);
  const customStyles = dark ? selectDarkStyles : {};
  const labelRef = useRef<HTMLDivElement | null>(null);

  const [fieldObj, setFieldObj] = useState<LabelBool>({
    harv: false,
    ranch: false,
    fruit: false,
    code: false,
    traceback: false,
    generic: false,
  });

  useClickOutside(labelRef, () => {
    setFieldObj((current) => {
      return {
        ...current,
        harv: false,
        ranch: false,
        fruit: false,
        code: false,
        traceback: false,
        generic: false,
      };
    });
  });

  const toggleOpen = (label: string) => {
    setFieldObj((current) => {
      return { ...current, [label]: !current[label as keyof LabelBool] };
    });
  };

  return (
    <>
      <div className="row mb-4 mt-2">
        <div className="col-md-6">
          <div className="form-group">
            <GenericLabel
              htmlFor="harv_ids"
              labelText="Harv IDS"
              model="Harvester"
              attr="harv_id"
              content="This is the serial number attached to each harvester"
              example="11, 100"
              field="harv"
              labelRef={labelRef}
              open={fieldObj.harv}
              toggleOpen={toggleOpen}
              theme={theme}
            />
            <Select
              isMulti
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
        <div className="col-md-6">
          <div className="form-group">
            <GenericLabel
              htmlFor="locations"
              labelText="Ranches"
              model="Location"
              attr="ranch"
              content="This is the ranch in which the harvester operates in"
              example="Ranch A, Ranch B"
              field="ranch"
              labelRef={labelRef}
              open={fieldObj.ranch}
              toggleOpen={toggleOpen}
              theme={theme}
            />
            <Select
              isMulti
              isSearchable
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
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="form-group">
            <GenericLabel
              htmlFor="fruit"
              labelText="Fruit"
              model="Fruit"
              attr="name"
              content="This is the fruit being picked by harvester (project-specific)"
              example="apple, strawberry"
              open={fieldObj.fruit}
              field="fruit"
              labelRef={labelRef}
              toggleOpen={toggleOpen}
              theme={theme}
            />
            <Select
              isMulti
              isSearchable
              placeholder="strawberry"
              options={fruitOptions}
              name="fruit"
              inputId="fruit"
              onChange={handleFruitSelect}
              defaultValue={selectedFruit}
              value={selectedFruit}
              className="multi-select-container"
              classNamePrefix="select"
              styles={customStyles}
            />
          </div>
        </div>
        <div className="col-md-6">
          <div className="form-group">
            <GenericLabel
              htmlFor="code"
              labelText="Code"
              model="AFTExceptionCode"
              attr="code"
              content="This is the code for the execption generated"
              example="0, 9"
              field="code"
              labelRef={labelRef}
              open={fieldObj.code}
              toggleOpen={toggleOpen}
              theme={theme}
            />
            <Select
              isMulti
              isSearchable
              placeholder="1,2,3,..."
              options={codeOptions}
              name="code"
              inputId="code"
              onChange={handleCodeSelect}
              defaultValue={selectedCode}
              value={selectedCode}
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
            <GenericLabel
              htmlFor="traceback"
              labelText="Traceback"
              model="AFTException"
              attr="traceback"
              content="This is the exception traceback string logged"
              example="ot/emu/emuRobotServ.py, line 112, in _move"
              field="traceback"
              labelRef={labelRef}
              open={fieldObj.traceback}
              toggleOpen={toggleOpen}
              theme={theme}
            />
            <InputFormControl
              type="text"
              name="traceback"
              id="traceback"
              value={fieldData?.traceback}
              onChange={handleFieldChange}
              placeholder="traceback string"
              theme={theme}
            />
          </div>
        </div>
        <div className="col-md-6">
          <div className="form-group">
            <GenericLabel
              htmlFor="generic"
              labelText="Generic LookUp"
              content="This is user coded django model lookup expressions or queries."
              example="harvester__harv_id=11, location__ranch=Ranch A"
              extras={{
                info: "This will translate to ",
                code: "ErrorReport.objects.filter(harvester__harv_id=11, location__ranch=Ranch A)",
              }}
              field="generic"
              labelRef={labelRef}
              open={fieldObj.generic}
              toggleOpen={toggleOpen}
              theme={theme}
            />
            <InputFormControl
              type="text"
              name="generic"
              id="generic"
              value={fieldData?.generic}
              onChange={handleFieldChange}
              placeholder="field__lookup=x, column_lookup=y"
              theme={theme}
            />
          </div>
        </div>
      </div>
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="form-check">
            <label htmlFor="emulator_1">Emulator</label>
            <input
              type="radio"
              name="is_emulator"
              value="1"
              id="emulator_1"
              checked={fieldData?.is_emulator === "1"}
              onChange={handleFieldChange}
              className="form-check-input"
            />
          </div>
          <div className="form-check">
            <label htmlFor="emulator_0">Harvesters</label>
            <input
              type="radio"
              name="is_emulator"
              value="0"
              id="emulator_0"
              checked={fieldData?.is_emulator === "0"}
              onChange={handleFieldChange}
              className="form-check-input"
            />
          </div>
          <div className="form-check">
            <label htmlFor="emulator_all">All</label>
            <input
              type="radio"
              name="is_emulator"
              value=""
              id="emulator_all"
              checked={fieldData?.is_emulator === ""}
              onChange={handleFieldChange}
              className="form-check-input"
            />
          </div>
        </div>
        <div className="col-md-6">
          <div className="form-check">
            <label htmlFor="handled_1">Handled</label>
            <input
              type="radio"
              name="handled"
              value="1"
              id="handled_1"
              checked={fieldData?.handled === "1"}
              onChange={handleFieldChange}
              className="form-check-input"
            />
          </div>
          <div className="form-check">
            <label htmlFor="handled_0">Unhandled</label>
            <input
              type="radio"
              name="handled"
              value="0"
              id="handled_0"
              checked={fieldData?.handled === "0"}
              onChange={handleFieldChange}
              className="form-check-input"
            />
          </div>
          <div className="form-check">
            <label htmlFor="handled_all">All</label>
            <input
              type="radio"
              name="handled"
              value=""
              id="handled_all"
              checked={fieldData?.handled === ""}
              onChange={handleFieldChange}
              className="form-check-input"
            />
          </div>
        </div>
      </div>
      <div className="row mb-4">
        <div className="col">
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id="primary"
              name="primary"
              checked={fieldData?.primary === true}
              onChange={handleFieldChange}
            />
            <label className="form-check-label" htmlFor="primary">
              Primary Only
            </label>
          </div>
        </div>
      </div>
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="form-group">
            <label htmlFor="start_time">Start Time</label>
            <InputFormControl
              type="text"
              name="start_time"
              id="start_time"
              value={fieldData?.start_time}
              onChange={handleFieldChange}
              placeholder="YYYYMMDDHHmmSS"
              theme={theme}
            />
          </div>
        </div>
        <div className="col-md-4">
          <div className="form-group">
            <label htmlFor="end_time">End Time</label>
            <InputFormControl
              type="text"
              name="end_time"
              id="end_time"
              value={fieldData?.end_time}
              onChange={handleFieldChange}
              placeholder="YYYYMMDDHHmmSS"
              theme={theme}
            />
          </div>
        </div>
        <div className="col-md-4">
          <div className="form-group">
            <label htmlFor="tz">Timezone</label>
            <Select
              isSearchable
              placeholder="US/Pacific"
              options={timezoneOptions}
              name="tz"
              inputId="tz"
              onChange={handleTimezoneSelect}
              defaultValue={selectedTimezone}
              value={selectedTimezone}
              className="multi-select-container"
              classNamePrefix="select"
              styles={customStyles}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export const FormQuery = (props: FormProps) => {
  const {
    handleFormQuerySubmit,
    handleGenPareto,
    handleModalPopUp,
    notifyRef,
  } = props;
  return (
    <form onSubmit={handleFormQuerySubmit} data-testid="query-form">
      <GenericFormField {...props} />
      <div className="form-group">
        <button type="submit" className="btn btn-primary btn-md">
          Submit
        </button>
        <button
          type="button"
          onClick={handleGenPareto}
          className="btn btn-primary btn-md mx-2"
        >
          Generate Pareto
        </button>
        <button
          onClick={handleModalPopUp}
          type="button"
          className="btn btn-primary"
        >
          Create Notification
        </button>
        <button
          ref={notifyRef}
          type="button"
          data-bs-toggle="modal"
          data-bs-target="#notificationModal"
          style={{ display: "none" }}
        >
          Create Notification
        </button>
      </div>
    </form>
  );
};

export const ExceptTabular = (props: TabularProps) => {
  const bg = darkThemeClass("bg-dark", props.theme);
  return (
    <div className="mb-3">
      <div className="d-flex">
        <div className={`tabular bg-gray ${bg}`}>Exception</div>
        <div className={`tabular bg-gray ${bg}`}>Timestamp</div>
      </div>
      <div className="d-flex">
        <div className="tabular">{props.exceptName}</div>
        <div className="tabular">{props.timestamp}</div>
      </div>
    </div>
  );
};

export const RightButtonGroup = (props: GroupProps) => {
  const btn = darkThemeClass("btn-dark", props.theme);
  return (
    <div className="flex-right mb-2">
      <span
        onClick={props.createNotifPopUp}
        className={`btn btn-default mx-2 ${btn}`}
      >
        Create Notification
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
        ref={props.createNotifRef}
        data-bs-toggle="modal"
        data-bs-target="#createNotifModal"
        style={{ display: "none" }}
      >
        Create Notification
      </button>
    </div>
  );
};

export const ParetoForm = (props: ParetoProps) => {
  const dark = darkThemeClass("dark-theme", props.theme);
  const customStyles = dark ? selectDarkStyles : {};
  return (
    <div className="mb-4">
      <form onSubmit={props.handleSubmit} data-testid="query-form">
        <GenericFormField {...props} />
        <div className="row mb-3">
          <div className="col">
            <div className="form-group">
              <label htmlFor="aggregate_query">Group By</label>
              <Select
                isSearchable
                isClearable
                isMulti
                placeholder="exception"
                options={aggregateOptions}
                name="aggregate_query"
                inputId="aggregate_query"
                onChange={props.handleAggreSelect}
                defaultValue={props.selectedAggregate}
                value={props.selectedAggregate}
                className="multi-select-container"
                classNamePrefix="select"
                styles={customStyles}
              />
            </div>
          </div>
        </div>
        <div className="text-center ">
          <button type="submit" className="btn btn-primary">
            Build Chart
          </button>
        </div>
      </form>
    </div>
  );
};

export const ParetoTabular = (props: ParetoTabProps) => {
  const bg = darkThemeClass("bg-dark", props.theme);
  return (
    <div>
      <div className="d-flex">
        <div className={`tabular bg-gray ${bg}`}>Property</div>
        <div className={`tabular bg-gray ${bg}`}>Value</div>
      </div>
      {props.paramsObj?.harv_ids && (
        <div className="d-flex">
          <div className="tabular">harv_ids</div>
          <div className="tabular">{props.paramsObj.harv_ids}</div>
        </div>
      )}
      {props.paramsObj?.locations && (
        <div className="d-flex">
          <div className="tabular">locations</div>
          <div className="tabular">{props.paramsObj.locations}</div>
        </div>
      )}
      {props.paramsObj?.fruits && (
        <div className="d-flex">
          <div className="tabular">fruits</div>
          <div className="tabular">{props.paramsObj.fruits}</div>
        </div>
      )}
      {props.paramsObj?.codes && (
        <div className="d-flex">
          <div className="tabular">codes</div>
          <div className="tabular">{props.paramsObj.codes}</div>
        </div>
      )}
      {props.paramsObj?.traceback && (
        <div className="d-flex">
          <div className="tabular">traceback</div>
          <div className="tabular">{props.paramsObj.traceback}</div>
        </div>
      )}
      {props.paramsObj?.tz && (
        <div className="d-flex">
          <div className="tabular">Timezone</div>
          <div className="tabular">{props.paramsObj.tz}</div>
        </div>
      )}
      {props.paramsObj?.start_time && (
        <div className="d-flex">
          <div className="tabular">start_time</div>
          <div className="tabular">{props.paramsObj.start_time}</div>
        </div>
      )}
      {props.paramsObj?.end_time && (
        <div className="d-flex">
          <div className="tabular">end_time</div>
          <div className="tabular">{props.paramsObj.end_time}</div>
        </div>
      )}
      {props.paramsObj?.generic && (
        <div className="d-flex">
          <div className="tabular">Generics</div>
          <div className="tabular">{props.paramsObj.generic}</div>
        </div>
      )}
      {props.paramsObj?.is_emulator && (
        <div className="d-flex">
          <div className="tabular">Is Emulator</div>
          <div className="tabular">{props.paramsObj.is_emulator}</div>
        </div>
      )}
      {props.paramsObj?.handled && (
        <div className="d-flex">
          <div className="tabular">Handled</div>
          <div className="tabular">{props.paramsObj.handled}</div>
        </div>
      )}
      {props.paramsObj?.aggregate_query && (
        <div className="d-flex">
          <div className="tabular">Group By</div>
          <div className="tabular">{props.paramsObj.aggregate_query}</div>
        </div>
      )}
      {props.paramsObj?.exceptions__primary && (
        <div className="d-flex">
          <div className="tabular">Primary Only</div>
          <div className="tabular">{props.paramsObj.exceptions__primary}</div>
        </div>
      )}
    </div>
  );
};
