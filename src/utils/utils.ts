/**
 * Module for Utility Functions
 * @module utils
 */

import { MultiValue } from "react-select";
import {
  API_URL,
  LOG_STR_PATTERN,
  MASTER_ROBOT,
  PushStateEnum,
  THEME_MODES,
} from "@/features/base/constants";
import {
  Breakdown,
  Exception,
  ExceptionCode,
  TransformException,
} from "@/features/exception/exceptionTypes";
import {
  ParamsString,
  ParetoItem,
  QueryObject,
  TransformedData,
} from "@/components/errorreport/ErrorHelpers";
import { Fruit } from "@/features/harvester/harvesterTypes";
import { User } from "@/features/auth/authTypes";
import {
  ErrorReportArray,
  ErroredService,
  SysmonKey,
  TransformErrorReport,
} from "@/features/errorreport/errorreportTypes";
import {
  RevertedOgShapeResult,
  SensorArrays,
  SensorData,
  SensorEntry,
  SensorObject,
  SensorRaw,
} from "@/features/autodiagnostic/autodiagnosticTypes";
import {
  Content,
  LogFile,
  Service,
  Video,
} from "@/features/logparser/logparserTypes";
import { JobSchema, JobType } from "@/features/harvjob/harvjobTypes";
import {
  ResultReport,
  ResultReportAddOn,
  SeriesTrace,
  TraceObj,
} from "@/features/emulatorstat/emulatorstatTypes";

/**
 * Evaluate for dark theme className
 * @param {string} className
 * @param {string} theme
 * @returns {string} string
 */
export const darkThemeClass = (
  className: string,
  theme: string | null,
): string => {
  return theme === THEME_MODES.DARK_THEME ? className : "";
};

export const selectDarkStyles = {
  option: (defaultStyles: any, state: any) => ({
    ...defaultStyles,
    color: state.isSelected ? "#212529" : "#fff",
    backgroundColor: state.isFocused ? "#a0a0a0" : "#212529",
  }),
  control: (defaultStyles: any) => ({
    ...defaultStyles,
    backgroundColor: "#212529",
  }),
  singleValue: (defaultStyles: any) => ({ ...defaultStyles, color: "#fff" }),
};

/**
 * @param {string} imgName
 * @param {string} ext optional
 * @returns {string} absolute image path
 * @example
 *  imagePath(cloud)
 *    // => http://localhost:3000/icons/cloud.png
 */
export const imagePath = (imgName: string, ext: string = "png"): string => {
  let url: string;
  if (import.meta.env.PROD) {
    url = import.meta.env.REACT_APP_HOSTED_URL;
  } else {
    url = `http://localhost:3000`;
  }
  return `${url}/icons/${imgName}.${ext}`;
};

/**
 * Check if the browser default theme is dark
 *
 * @returns {boolean} boolean
 */
export const isBrowserDefaultDark = (): boolean => {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
};

/**
 * Convert the search params to object
 * @param params any
 * @returns
 */
export const paramsToObject = (params: any = {}) => {
  const urlparams = new URLSearchParams(params);
  const result: Record<string, any> = {};
  for (const [key, value] of urlparams.entries()) {
    result[key] = value;
  }
  return result;
};

/**
 * Construct the new URL for the history methods
 * @param queryObj
 * @param pareto
 * @returns
 */
const buildNewURL = (queryObj: Record<string, any> = {}, pareto?: string) => {
  let newurl;
  let params = new URLSearchParams(queryObj);
  if (pareto === PushStateEnum.GENPARETO) {
    newurl = `${window.location.protocol}//${
      window.location.host
    }/errorreports/?aggregate_query=code__name&${params.toString()}`;
  } else if (pareto === PushStateEnum.BUILDCHART) {
    newurl = `${window.location.protocol}//${
      window.location.host
    }/errorreports/view/pareto/?${params.toString()}`;
  } else if (pareto === PushStateEnum.RELEASECODE) {
    newurl = `${window.location.protocol}//${
      window.location.host
    }/release/?${params.toString()}`;
  } else if (pareto === PushStateEnum.EVENTS) {
    newurl = `${window.location.protocol}//${
      window.location.host
    }/events/?${params.toString()}`;
  } else if (pareto === PushStateEnum.PICKSESSIONS) {
    newurl = `${window.location.protocol}//${
      window.location.host
    }/picksessions/?${params.toString()}`;
  } else if (pareto === PushStateEnum.JOBS) {
    newurl = `${window.location.protocol}//${
      window.location.host
    }/jobs/?${params.toString()}`;
  } else if (pareto === PushStateEnum.S3FILES) {
    newurl = `${window.location.protocol}//${
      window.location.host
    }/s3files/?${params.toString()}`;
  } else if (pareto === PushStateEnum.AUTODIAGNOSTICS) {
    newurl = `${window.location.protocol}//${
      window.location.host
    }/autodiagnostics/?${params.toString()}`;
  } else if (pareto === PushStateEnum.EMULATORSTATS) {
    newurl = `${window.location.protocol}//${
      window.location.host
    }/emustats/?${params.toString()}`;
  } else if (pareto === PushStateEnum.EMULATORCHART) {
    newurl = `${window.location.protocol}//${
      window.location.host
    }/emucharts/?${params.toString()}`;
  } else if (pareto === PushStateEnum.TRACEBACKBREAKDOWN) {
    newurl = `${window.location.protocol}//${
      window.location.host
    }/tracebackbreakdown/?${params.toString()}`;
  } else if (pareto === PushStateEnum.HARVESTERSWINFO) {
    newurl = `${window.location.protocol}//${
      window.location.host
    }/harvesterswinfo/?${params.toString()}`;
  } else {
    newurl = `${window.location.protocol}//${
      window.location.host
    }/errorreports/?${params.toString()}`;
  }
  return newurl;
};

/**
 * The `History.pushState()` method adds an entry to the
 * browser's session history stack. This method is asynchronous.
 *
 * @description Note that the browser won't attempt to load
 * the new history entry's URL after a call to pushState(),
 * but it may attempt to load the URL later, for instance,
 * after the user restarts the browser. The new URL does not
 * need to be absolute; if it's relative, it's resolved relative
 * to the current URL. The new URL must be of the same origin
 * as the current URL; otherwise, pushState() will throw an
 * exception. If this parameter isn't specified, it's set to the
 * document's current URL.
 * @param queryObj
 * @param pareto
 */
export const pushState = (
  queryObj: Record<string, any> = {},
  pareto?: string,
) => {
  let newurl = buildNewURL(queryObj, pareto);
  window.history.pushState({}, "", newurl);
};

/**
 * The `History.replaceState()` method modifies the current
 * history entry, replacing it with the state object and URL
 * passed in the method parameters. This method is particularly
 * useful when you want to update the state object or URL of
 * the current history entry in response to some user action.
 *
 * @description Note that the URL of the history entry must be
 * of the same origin as the current URL; otherwise replaceState
 * throws an exception.
 * @param queryObj
 * @param pareto
 */
export const replaceState = (
  queryObj: Record<string, any> = {},
  pareto?: string,
) => {
  let newurl = buildNewURL(queryObj, pareto);
  window.history.replaceState({}, "", newurl);
};

/**
 * An abstract function to implement handle select state
 * @param {Function} setSelectedFunc
 * @returns Function
 */
export function handleSelectFactory(setSelectedFunc: Function) {
  const handleSelect = (newValue: MultiValue<any>) => {
    setSelectedFunc(newValue);
  };
  return handleSelect;
}

/**
 * Transform tags into required arrays
 * @param {Array} tags
 * @returns
 */
export const transformTagsOptions = (tags: Array<string> = []) => {
  return tags.map((tag) => {
    return { value: tag, label: tag };
  });
};

/**
 * Transform distributors objs into required shape
 * @param {Array} distributors
 * @returns
 */
export const transformDistOptions = (
  distributors: Array<{ id: number; name: string }>,
) => {
  return distributors.map((distributor, _) => {
    return { value: distributor.id, label: distributor.name };
  });
};

/**
 * Map the current offset for pagination
 * @param previous
 * @param next
 * @returns
 */
export const mapCurrentOffset = (previous?: string, next?: string) => {
  let url: URL;
  let limit: number;
  let offset: number;
  let paramsObj: Record<string, any> = {};
  if (previous) {
    url = new URL(previous);
    limit = url.searchParams.get("limit") as unknown as number;
    offset = (url.searchParams.get("offset") as unknown as number) || 0;
    paramsObj = paramsToObject(url.searchParams.toString());
    let current = limit + offset;
    paramsObj["offset"] = current;
    paramsObj["limit"] = limit;
    pushState(paramsObj);
  } else if (!previous && next) {
    url = new URL(next);
    limit = url.searchParams.get("limit") as unknown as number;
    url.searchParams.delete("offset");
    const paramsObj = paramsToObject(url.searchParams.toString());
    paramsObj["limit"] = limit;
    pushState(paramsObj);
  }
  return paramsObj;
};

/**
 * Padd start the string with the given digits
 * @param str_to_pad
 * @param digits
 * @returns
 */
function padZeros(str_to_pad: number, digits: number) {
  return str_to_pad.toString().padStart(digits, "0");
}

/**
 * Convert the date string to the user's timezone
 * @param dateString
 * @param timezone
 * @returns
 */
export function timeStampFormat(dateString: Date, timezone = "US/Pacific") {
  let date;
  if (typeof timezone === "string") {
    date = new Date(
      new Date(dateString).toLocaleString("en-US", { timeZone: timezone }),
    );
  } else {
    date = new Date(dateString);
  }
  let y = date.getFullYear().toString();
  let m = padZeros(date.getMonth() + 1, 2);
  let d = padZeros(date.getDate(), 2);
  let H = padZeros(date.getHours(), 2);
  let M = padZeros(date.getMinutes(), 2);
  let S = padZeros(date.getSeconds(), 2);
  let mm = date.getMilliseconds().toString();
  return `${y}${m}${d}T${H}${M}${S}.${mm}`;
}

/**
 * Get date values from the native Date object provided as string
 * @param dateString
 * @returns
 */
const getDateValues = (dateString: string) => {
  let year = Number(dateString.slice(0, 3 + 1));
  let month = Number(dateString.slice(4, 5 + 1)) - 1;
  let day = Number(dateString.slice(6, 7 + 1));
  let hours = Number(dateString.slice(8, 9 + 1));
  let minutes = Number(dateString.slice(10, 11 + 1));
  let second = Number(dateString.slice(12, dateString.length));
  return { year, month, day, hours, minutes, second };
};

/**
 * Extract date from user given string date in the format
 * e.g
 *
 * i. YYYYMMDDTHHMMSS.S
 *
 * ii. YYYYMMDDHHMMSS
 *
 * iii. YYYYMDHMS
 *
 * @param dateString
 * @returns
 */
export const extractDateFromString = (dateString: string) => {
  if (
    typeof dateString === "string" &&
    dateString.includes("T") &&
    dateString.includes(".")
  ) {
    let splittedArr = dateString.split(".");
    let dateStr = splittedArr[0].replace("T", "");
    let ms = splittedArr[1];
    if (dateStr.length === 14) {
      let { year, month, day, hours, minutes, second } = getDateValues(dateStr);
      return new Date(year, month, day, hours, minutes, second, Number(ms));
    } else {
      let paddedDateString = dateStr.padEnd(14, "0");
      let { year, month, day, hours, minutes, second } =
        getDateValues(paddedDateString);
      return new Date(year, month, day, hours, minutes, second, Number(ms));
    }
  } else if (typeof dateString === "string" && dateString.includes("T")) {
    let dateStr = dateString.replace("T", "");
    if (dateStr.length === 14) {
      let { year, month, day, hours, minutes, second } = getDateValues(dateStr);
      return new Date(year, month, day, hours, minutes, second);
    } else {
      let paddedDateString = dateStr.padEnd(14, "0");
      let { year, month, day, hours, minutes, second } =
        getDateValues(paddedDateString);
      return new Date(year, month, day, hours, minutes, second);
    }
  } else if (typeof dateString === "string" && dateString.length === 14) {
    let { year, month, day, hours, minutes, second } =
      getDateValues(dateString);
    return new Date(year, month, day, hours, minutes, second);
  } else if (typeof dateString === "string") {
    let paddedDateString = dateString.padEnd(14, "0");
    let { year, month, day, hours, minutes, second } =
      getDateValues(paddedDateString);
    return new Date(year, month, day, hours, minutes, second);
  } else {
    return new Date();
  }
};

export const aggregateOptions = [
  { label: "service", value: "service" },
  { label: "harvester", value: "report__harvester__name" },
  { label: "exception", value: "code__name" },
  { label: "team", value: "code__team" },
  { label: "robot", value: "robot" },
  { label: "location", value: "report__location__ranch" },
  { label: "handled", value: "handled" },
  { label: "emulator", value: "report__harvester__is_emulator" },
];

/**
 * return the api url with optional query string
 * @param {object} paramsObj
 * @returns {String}
 */
export const copiedUrl = (paramsObj: Record<string, any>): string => {
  const searchParams = new URLSearchParams(paramsObj);
  return `${API_URL}/errorreports/?${searchParams.toString()}`;
};

/**
 * Transform harvester array into required select shape
 * @param harvesters
 * @returns
 */
export const transformHarvOptions = (
  harvesters: Array<{ harv_id: number }>,
) => {
  return harvesters.map((harvester, _) => {
    return { value: harvester.harv_id, label: harvester.harv_id };
  });
};

/**
 * Transform location array into required select shape
 * @param locations
 * @param includeID
 * @returns
 */
export const transformLocOptions = (
  locations: Array<{ id: number; ranch: string }>,
  includeID?: boolean,
) => {
  if (includeID) {
    return locations.map((loc, _) => {
      return { value: loc.id, label: loc.ranch };
    });
  }
  return locations.map((loc, _) => {
    return { value: loc.ranch, label: loc.ranch };
  });
};

/**
 * Translate harvester select option to required shape
 * @param harv_ids
 * @returns
 */
export const translateHarvOptions = (
  harv_ids: Array<{ label: string; value: number }>,
) => {
  return harv_ids.map((harv_id) => {
    return harv_id.value;
  });
};

/**
 * Translate location select option to required shape
 * @param loc_names
 * @returns
 */
export const translateLocOptions = (
  loc_names: Array<{ label: string; value: string }>,
) => {
  return loc_names.map((loc) => {
    return loc.value;
  });
};

/**
 * Translate fruit select option to required shape
 * @param fruits
 * @returns
 */
export const translateFruitOptions = (
  fruits: Array<{ label: string; value: string }>,
) => {
  return fruits.map((fruit) => {
    return fruit.value;
  });
};

/**
 * Append code names to the codes array
 * @param codes
 * @param exceptioncodes
 * @returns
 */
export const appendCodeName = (
  codes: Array<string>,
  exceptioncodes: Array<ExceptionCode>,
) => {
  const arr: Array<{ label: string; value: number }> = [];
  exceptioncodes.forEach((x) => {
    if (codes.includes(String(x.code))) {
      arr.push({ value: x.code, label: `${x.code}: ${x.name}` });
    }
  });
  return arr;
};

/**
 * Transform fruit into required select shape
 * @param fruits
 * @param includeID
 * @returns
 */
export const transformFruitOptions = (
  fruits: Array<Fruit>,
  includeID?: boolean,
) => {
  if (includeID) {
    return fruits.map((fruit) => {
      return { value: fruit.id, label: fruit.name };
    });
  }
  return fruits.map((fruit) => {
    return { value: fruit.name, label: fruit.name };
  });
};

/**
 * Transform exception code into required select shape
 * @param codes
 * @returns
 */
export const transformCodeOptions = (codes: Array<ExceptionCode>) => {
  return codes.map((code) => {
    return { value: code.code, label: `${code.code}: ${code.name}` };
  });
};

/**
 * Translate exception code select options into required shape
 * @param codes
 * @returns
 */
export const translateCodeOptions = (
  codes: Array<{ label: string; value: number }>,
) => {
  return codes.map((code) => {
    return code.value;
  });
};

/**
 * Transform users into required select shape
 * @param users
 * @returns
 */
export const transformUserOptions = (users: Array<User>) => {
  return users.map((user) => {
    return { value: user.id, label: user.username };
  });
};

/**
 * Translate users select options into required shape
 * @param users
 * @returns
 */
export const translateUserOptions = (
  users: Array<{ label: string; value: number }>,
) => {
  return users.map((user) => {
    return user.value;
  });
};

/**
 * Transform timezone into required select shape
 * @param timezones
 * @returns
 */
export const transformTzOptions = (timezones: Array<string>) => {
  return timezones.map((zone) => {
    return { value: zone, label: zone };
  });
};

export const uuid = () => {
  const hashTable = [
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
  ];
  let uuid = [];
  for (let i = 0; i < 35; i++) {
    if (i === 7 || i === 12 || i === 17 || i === 22) {
      uuid[i] = "-";
    } else {
      uuid[i] = hashTable[Math.floor(Math.random() * hashTable.length - 1)];
    }
  }
  return uuid.join("");
};

/**
 * Validate that the query object is not empty
 * @param queryObj
 * @returns
 */
export const validateQueryObj = (queryObj: QueryObject) => {
  if (
    queryObj.harv_ids ||
    queryObj.locations ||
    queryObj.fruits ||
    queryObj.codes ||
    queryObj.traceback ||
    queryObj.generic ||
    queryObj.handled ||
    queryObj.is_emulator
  ) {
    return true;
  } else {
    return false;
  }
};

/**
 *
 * @param {QueryObject} fieldData
 * @param {Array} selectedHarvId
 * @param {Array} selectedLocation
 * @param {object} selectedTimezone
 * @param {Array} selectedFruit
 * @param {Array} selectedCode
 * @returns
 */
export const buildQueryObj = (
  fieldData: QueryObject,
  selectedHarvId: any,
  selectedLocation: any,
  selectedTimezone: any,
  selectedFruit: any,
  selectedCode: any,
) => {
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
  if (selectedHarvId && selectedHarvId.length > 0) {
    queryObj["harv_ids"] = translateHarvOptions(selectedHarvId);
  }
  if (selectedLocation && selectedLocation.length > 0) {
    queryObj["locations"] = translateLocOptions(selectedLocation);
  }
  if (selectedTimezone && selectedTimezone.hasOwnProperty("value")) {
    queryObj["tz"] = selectedTimezone.value;
  }
  if (selectedFruit && selectedFruit.length > 0) {
    queryObj["fruits"] = translateFruitOptions(selectedFruit);
  }
  if (selectedCode && selectedCode.length > 0) {
    queryObj["codes"] = translateCodeOptions(selectedCode);
  }
  if (fieldData.traceback) {
    queryObj["traceback"] = fieldData.traceback;
  }
  if (fieldData.generic) {
    queryObj["generic"] = fieldData.generic;
  }
  if (fieldData.is_emulator) {
    queryObj["is_emulator"] = fieldData.is_emulator;
  }
  if (fieldData.handled) {
    queryObj["handled"] = fieldData.handled;
  }
  if (fieldData.primary) {
    queryObj["primary"] = fieldData.primary;
  }
  if (fieldData.start_hour) {
    queryObj["start_hour"] = fieldData.start_hour;
  }
  if (fieldData.end_hour) {
    queryObj["end_hour"] = fieldData.end_hour;
  }

  return queryObj;
};

/**
 * Compute start time as one week earlier & end tme
 * as now
 *
 * This allows for faster retrival of errorreports due to
 * numerous records.
 * @returns
 */
export const getDateRange = (days: number = 7) => {
  let now = new Date();
  let oneWeekEarlier = new Date(now);
  oneWeekEarlier.setDate(now.getDate() - days);

  return {
    start_time: timeStampFormat(oneWeekEarlier),
    end_time: timeStampFormat(now),
  };
};

/**
 *
 * @param {ParamsString} paramsObj
 * @param {Array} exceptioncodes
 * @param {Function} setSelectedHarvId
 * @param {Function} setSelectedLocation
 * @param {Function} setSelectedFruit
 * @param {Function} setSelectedCode
 * @param {Function} setFieldData
 * @param {Function} setSelectedTimezone
 * @param {Function} setSelectedAggregate
 */
export const mapParamsObject = (
  paramsObj: ParamsString,
  exceptioncodes: Array<ExceptionCode>,
  setSelectedHarvId: (arg0: any) => void,
  setSelectedLocation: (arg0: any) => void,
  setSelectedFruit: (arg0: any) => void,
  setSelectedCode: (arg0: any) => void,
  setFieldData: (arg0: { (current: any): any }) => void,
  setSelectedTimezone: (arg0: any) => void,
  setSelectedAggregate: (arg0: any) => void,
) => {
  if (paramsObj.harv_ids) {
    let harv_ids = paramsObj.harv_ids.split(",").map((harv_id) => {
      return { value: Number(harv_id), label: Number(harv_id) };
    });
    setSelectedHarvId(harv_ids);
  }
  if (paramsObj.locations) {
    let locations = paramsObj.locations.split(",").map((loc) => {
      return { value: loc, label: loc };
    });
    setSelectedLocation(locations);
  }
  if (paramsObj.fruits) {
    let fruits = paramsObj.fruits.split(",").map((fruit) => {
      return { value: fruit, label: fruit };
    });
    setSelectedFruit(fruits);
  }
  if (paramsObj.codes) {
    let codes = paramsObj.codes.split(",");
    let codenames = appendCodeName(codes, exceptioncodes);
    setSelectedCode(codenames);
  }
  if (paramsObj.traceback) {
    setFieldData((current) => {
      return { ...current, traceback: paramsObj.traceback };
    });
  }
  if (paramsObj.start_time) {
    setFieldData((current) => {
      return {
        ...current,
        start_time: paramsObj.start_time,
      };
    });
  }
  if (paramsObj.end_time) {
    setFieldData((current) => {
      return {
        ...current,
        end_time: paramsObj.end_time,
      };
    });
  }
  if (paramsObj.tz) {
    let tzObj = { value: paramsObj.tz, label: paramsObj.tz };
    setSelectedTimezone(tzObj);
  }
  if (paramsObj.generic) {
    setFieldData((current) => {
      return { ...current, generic: paramsObj.generic };
    });
  }
  if (paramsObj.is_emulator) {
    setFieldData((current) => {
      return { ...current, is_emulator: paramsObj.is_emulator };
    });
  }
  if (paramsObj.handled) {
    setFieldData((current) => {
      return { ...current, handled: paramsObj.handled };
    });
  }
  if (paramsObj.primary) {
    setFieldData((current) => {
      return { ...current, primary: Boolean(paramsObj.primary) };
    });
  }
  if (paramsObj.group_by) {
    const groups = paramsObj.group_by.split(",");
    const newGroup = aggregateOptions.filter((x) => groups.includes(x.value));
    setSelectedAggregate(newGroup);
  }
  if (paramsObj.start_hour) {
    setFieldData((current) => {
      return { ...current, start_hour: paramsObj.start_hour };
    });
  }
  if (paramsObj.end_hour) {
    setFieldData((current) => {
      return { ...current, end_hour: paramsObj.end_hour };
    });
  }
};

/**
 * Get services in error state
 * @param exceptions
 * @param sysmonReport
 * @returns
 */
export const getServicesInError = (
  exceptions: Array<Exception>,
  sysmonReport: Record<string, any>,
) => {
  let errors = [];
  for (let i = 0; i < exceptions.length; i++) {
    let robotNumber = exceptions[i].robot;
    let service = `${exceptions[i].service}.${exceptions[i].robot}`;
    let robotIndex = `Robot ${robotNumber}`;
    if (robotNumber === MASTER_ROBOT) {
      if (sysmonReport["Master"]) {
        errors.push({ service, robot: robotNumber });
      }
    } else {
      if (sysmonReport[robotIndex]) {
        errors.push({ service, robot: robotNumber });
      }
    }
  }
  return errors;
};

/**
 * Extract service and codes from exception array
 * @param exceptions
 * @returns
 */
export const extractServiceCodes = (exceptions: Array<Exception>) => {
  const services: Array<string> = [];
  const codes: Array<string> = [];
  /**
   * If exception is primary (*) is added to service & code
   * @param {Boolean} primary
   * @returns {string}
   */
  function checkPrimary(primary: boolean): string {
    return primary ? "*" : "";
  }
  exceptions.forEach((exec) => {
    services.push(`${exec.service}.${exec.robot}${checkPrimary(exec.primary)}`);
    codes.push(`${exec.code.code}${checkPrimary(exec.primary)}`);
  });
  return { services, codes };
};

/**
 * Transform error report into required shape
 * @param reports
 * @returns
 */
export const transformErrorReport = (reports: Array<ErrorReportArray>) => {
  return reports.map((report) => {
    const reportObj = {
      reportId: report.id,
      reportTime: report.reportTime,
      location: report.location,
      harvester: report.harvester,
      serial_number: report.harvester.harv_id,
      githash: report.githash,
      branch_name: report.gitbranch,
      exceptions: report.exceptions,
    };
    const resultObj = Object.assign({}, reportObj, ...report.exceptions);
    const { services, codes } = extractServiceCodes(report.exceptions);
    resultObj["service"] = services.join(", ");
    resultObj["code"] = codes.join(", ");
    return resultObj;
  });
};

/**
 * Transform exception array into required array of objects
 * @param exceptions
 * @returns exceptions
 */
export const transformExceptions = (exceptions: Array<Exception>) => {
  const exceptArr: Array<TransformException> = [];
  exceptions.forEach((obj) => {
    exceptArr.push({
      exec_label: `${obj.service}.${obj.robot}: ${obj.code.code}`,
      ...obj,
    });
  });
  return exceptArr;
};

/**
 * Transform error report detail into required shape
 * @param report
 * @returns
 */
export const transformReportDetail = (report: TransformErrorReport) => {
  const reportObj = { ...report };
  const { services, codes } = extractServiceCodes(reportObj.exceptions);
  reportObj["service"] = services.join(", ");
  reportObj["code"] = codes.join(", ");
  return reportObj;
};

/**
 * Get the robot in error
 * @param exception
 * @param sysmonReport
 * @returns
 */
export const robotInError = (
  exception: { service: string; robot: number },
  sysmonReport: Record<string, any>,
) => {
  let robot: Record<string, any> = {};
  let robotNumber = exception.robot;
  robot["error"] = true;
  if (Number(robotNumber) === MASTER_ROBOT) {
    robot["robot"] = "Master";
    robot["arm"] = null;
  } else {
    let robotIndex = `Robot ${robotNumber}`;
    let service = `${exception.service}.${exception.robot}`;
    robot["robot"] = robotIndex;
    if (sysmonReport[robotIndex]["NUC"]?.["services"]?.[service]) {
      robot["arm"] = "NUC";
    } else if (sysmonReport[robotIndex]["JETSON"]?.["services"]?.[service]) {
      robot["arm"] = "JETSON";
    }
  }
  return robot;
};

/**
 * Transform sysmon keys into required shape
 * @param sysmonkeys
 * @param services
 * @param sysmon
 * @returns
 */
export const transformSysmonKeys = (
  sysmonkeys: Array<string>,
  services: Array<{ service: string; robot: number }>,
  sysmon: Record<string, any> = {},
) => {
  let errored: Array<Record<string, any>> = [];
  services.forEach((service) => {
    let robot = robotInError(service, sysmon);
    errored.push(robot);
  });

  let erroredObj: Record<string, any> = {};
  errored.forEach((service) => {
    erroredObj[service.robot] = service;
  });

  const resultKeys: Array<SysmonKey> = [];
  sysmonkeys.forEach((key) => {
    if (Object.keys(erroredObj).includes(key)) {
      resultKeys.push({ robot: key, error: true, arm: erroredObj[key]?.arm });
    } else {
      resultKeys.push({ robot: key, error: false, arm: erroredObj[key]?.arm });
    }
  });
  return resultKeys;
};

/**
 * Transform sysmon report object
 * @param sysmonReport
 * @returns
 */
export const transformSysmonReport = (
  sysmonReport: Record<string, any> = {},
) => {
  const sysReport: Record<string, any> = {};
  let masterIndex = 0;
  for (const [key, value] of Object.entries(sysmonReport)) {
    let sysIndex = key.split(".")[1];
    let robotIndex: number;
    let sysmonIndex: number;
    if (sysIndex) {
      sysmonIndex = Number(sysIndex);
      robotIndex = Number(value["robot_index"]) || sysmonIndex;
    } else {
      continue;
    }
    if (sysmonIndex === masterIndex) {
      sysReport["Master"] = value;
    } else if (robotIndex === sysmonIndex) {
      let robot = `Robot ${robotIndex}`;
      if (!sysReport[robot]) {
        sysReport[robot] = {};
      }
      if (!("NUC" in sysReport[robot])) {
        sysReport[robot] = { ...sysReport[robot], NUC: {} };
      }
      sysReport[robot]["NUC"] = value;
    } else {
      let robot = `Robot ${robotIndex}`;
      if (!sysReport[robot]) {
        sysReport[robot] = {};
      }
      if (!("JETSON" in sysReport[robot])) {
        sysReport[robot] = { ...sysReport[robot], JETSON: {} };
      }
      sysReport[robot]["JETSON"] = value;
    }
  }
  return sysReport;
};

/**
 * Transform sysmon services
 * @param sysmon
 * @returns
 */
export const transformSysmonServices = (sysmon: Record<string, any> = {}) => {
  const sysmonArr = [];
  for (const [key, value] of Object.entries(sysmon)) {
    let service = [];
    service.push(key);
    service.push(value["cpu"]);
    service.push(value["mem"]);
    if (value?.fsm?.components)
      service.push(value["fsm"]["components"].join(", "));
    sysmonArr.push(service);
  }
  return sysmonArr;
};

/**
 * Transform errored services into required shape
 *
 * @param {Array} errors
 * @example
 *    input = [{'service': 'harvester.0', 'robot': 0}]
 *    output = [harvester.0]
 * @returns services
 */
export const mapErroredServices = (errors: Array<ErroredService>) => {
  return errors.map((x) => x.service);
};

export const monacoOptions = {
  acceptSuggestionOnCommitCharacter: true,
  acceptSuggestionOnEnter: "on",
  accessibilitySupport: "auto",
  autoIndent: false,
  automaticLayout: true,
  codeLens: true,
  colorDecorators: true,
  contextmenu: true,
  cursorBlinking: "blink",
  cursorSmoothCaretAnimation: false,
  cursorStyle: "line",
  disableLayerHinting: false,
  disableMonospaceOptimizations: false,
  dragAndDrop: false,
  fixedOverflowWidgets: false,
  folding: true,
  foldingStrategy: "auto",
  fontLigatures: false,
  formatOnPaste: false,
  formatOnType: true,
  hideCursorInOverviewRuler: false,
  highlightActiveIndentGuide: true,
  links: true,
  mouseWheelZoom: false,
  multiCursorMergeOverlapping: true,
  multiCursorModifier: "alt",
  overviewRulerBorder: true,
  overviewRulerLanes: 2,
  quickSuggestions: true,
  quickSuggestionsDelay: 100,
  readOnly: false,
  renderControlCharacters: false,
  renderFinalNewline: "on",
  renderIndentGuides: true,
  renderLineHighlight: "all",
  renderWhitespace: "none",
  revealHorizontalRightPadding: 30,
  roundedSelection: true,
  rulers: [],
  scrollBeyondLastColumn: 5,
  scrollBeyondLastLine: true,
  selectOnLineNumbers: true,
  selectionClipboard: true,
  selectionHighlight: true,
  showFoldingControls: "mouseover",
  smoothScrolling: false,
  suggestOnTriggerCharacters: true,
  wordBasedSuggestions: true,
  wordSeparators: "~!@#$%^&*()-=+[{]}|;:'\",.<>/?",
  wordWrap: "on",
  wordWrapBreakAfterCharacters: "\t})]?|&,;",
  wordWrapBreakBeforeCharacters: "{([+",
  wordWrapBreakObtrusiveCharacters: ".",
  wordWrapColumn: 80,
  wordWrapMinified: true,
  wrappingIndent: "none",
};

export const sortReduceParetos = (
  paretos: ParetoItem[] = [],
): TransformedData => {
  paretos.sort((a, b) => b.count - a.count);

  const [xlabels, ydata] = paretos.reduce<[string[], number[]]>(
    (acc, pareto) => {
      const [xlabelsAcc, ydataAcc] = acc;
      return [
        [...xlabelsAcc, pareto.value],
        [...ydataAcc, pareto.count],
      ];
    },
    [[], []],
  );

  return { xlabels, ydata };
};

/**
 * Check if aft-config has traceback or error data
 * sent. This takes into account that error and traceback
 * of type string
 * @param config
 * @returns
 */
export const hasTraceback = (config: Record<string, any> = {}) => {
  for (const key in config) {
    if (typeof config[key] !== "object") {
      return true;
    }
  }
  return false;
};

/**
 * Transform aft-config report and pop out conf_default_(host) since it's too large for rendering(legacy)
 *
 * New config report is compartible but doesn't need poping off conf_default_(host)
 * @param config
 * @returns
 */
export const transformConfig = (config: Record<string, any> = {}) => {
  if (hasTraceback(config)) {
    return { errored: true, obj: config };
  } else {
    const newObj: Record<string, any> = {};
    for (const key in config) {
      const value = config[key];
      for (const innerKey in value) {
        if (innerKey.includes("conf_default")) {
          delete value[innerKey];
        } else {
          newObj[key] = value;
        }
      }
    }
    return { errored: false, obj: newObj };
  }
};

/**
 * Return the keys as array of a given object
 * @param {object} obj
 * @returns
 */
export const objectKeys = (obj: Record<string, any> = {}) => {
  return Object.keys(obj);
};

/**
 * Convert string to Title case
 * @param str
 * @param separator
 * @returns
 */
export const titleCase = (str: string, separator: string = " "): string => {
  let strArr = str.toLowerCase().split(separator);
  for (var i = 0; i < strArr.length; i++) {
    strArr[i] = strArr[i].charAt(0).toUpperCase() + strArr[i].slice(1);
  }
  return strArr.join(" ");
};

/**
 * Get history type from symbol
 * @param historyType
 * @returns
 */
export const getHistoryType = (historyType: string) => {
  return historyType === "+"
    ? "created"
    : historyType === "~"
    ? "updated"
    : historyType === "-"
    ? "deleted"
    : "";
};

/**
 * Sorts the sensors array by timestamp
 * @param arr
 * @returns
 */
const sortByTimestamp = (arr: SensorData[] = []) => {
  return arr.sort((a, b) => a.ts - b.ts);
};

/**
 *  revert back the sensors to original data structure
 *  and perform necessary calculations
 * @param sortedSensors
 * @returns
 */
const revertOgShapeAndCalculate = (sortedSensors: SensorData[] = []) => {
  const originalFormat = new Map<string, SensorData[]>();
  const t0 = sortedSensors[0]?.ts || 0;

  for (const sensor of sortedSensors) {
    const values = originalFormat.get(sensor.state) || [];
    values.push(sensor);
    originalFormat.set(sensor.state, values);
  }

  const obj: RevertedOgShapeResult = {
    values: [],
    states: [],
    timestamps: [],
    ts_interval: [],
  };

  for (const [state, values] of originalFormat) {
    for (const value of values) {
      obj.states.push(state);
      obj.values.push(value.value);
      obj.timestamps.push(+(value.ts - t0).toFixed(7));
    }
    const diff = +(values[values.length - 1]?.ts - values[0]?.ts).toFixed(7);
    const x0 = +(values[0].ts - t0).toFixed(7);
    obj.ts_interval.push({
      state,
      x0,
      x1: 0, // To be filled later
      diff,
      max: 0, // To be filled later
      min: 0, // To be filled later
    });
  }

  for (let i = 0; i < obj.ts_interval.length; i++) {
    if (obj.ts_interval[i + 1]) {
      obj.ts_interval[i].x1 = obj.ts_interval[i + 1].x0;
    } else {
      obj.ts_interval[i].x1 = obj.ts_interval[i].x0 + obj.ts_interval[i].diff;
    }
    obj.ts_interval[i].max = Math.ceil(Math.max(...obj.values));
    obj.ts_interval[i].min = Math.floor(Math.min(...obj.values));
  }

  return obj;
};

/**
 * Transform sensors data object into required state
 * @param sensors
 * @returns
 */
export const transformSensors = (sensors: SensorObject = {}) => {
  const toSensorArray = (
    key: string,
    value: SensorEntry[],
    prop: string,
  ): SensorData[] => {
    return value.reduce((acc: SensorData[], [ts, values]: SensorEntry) => {
      if (!isNaN(values[prop as keyof SensorRaw])) {
        acc.push({ state: key, ts, value: values[prop as keyof SensorRaw] });
      }
      return acc;
    }, []);
  };

  const sensorArrays: SensorArrays = Object.entries(sensors).reduce(
    (acc: any, [key, value]) => {
      acc.touch.push(...toSensorArray(key, value, "touch"));
      acc.vacuum.push(...toSensorArray(key, value, "vac"));
      acc.finger.push(...toSensorArray(key, value, "finger"));
      return acc;
    },
    { touch: [], vacuum: [], finger: [] },
  );

  const touch = revertOgShapeAndCalculate(sortByTimestamp(sensorArrays.touch));
  const vacuum = revertOgShapeAndCalculate(
    sortByTimestamp(sensorArrays.vacuum),
  );
  const finger = revertOgShapeAndCalculate(
    sortByTimestamp(sensorArrays.finger),
  );

  return { touch, vacuum, finger };
};

/**
 * This implements the binary search algorithm
 * to find the closest timestamp from the
 * logs timestamp
 * @param target
 *
 * @param arr array of log entries
 *
 *    => target is the timestamp to find e.g
 *       1667345034.422079
 *
 *    => arr is the array of log objects containing
 *        timestamp, log_message, and log_date
 * finds the closest or exact timestamp
 *
 * @returns log object
 */
export function findClosest(target: number, arr: Array<Content>): Content {
  let n = arr.length;

  if (target <= arr[0]?.timestamp) return arr[0];
  if (target >= arr[n - 1]?.timestamp) return arr[n - 1];

  let start = 0;
  let end = n;
  let mid = 0;
  while (start < end) {
    mid = Math.floor((start + end) / 2);

    if (arr[mid]?.timestamp === target) return arr[mid];

    if (target < arr[mid]?.timestamp) {
      if (mid > 0 && target > arr[mid - 1]?.timestamp) {
        return getClosest(arr[mid - 1], arr[mid], target);
      }
      end = mid;
    } else {
      if (mid < n - 1 && target < arr[mid + 1]?.timestamp) {
        return getClosest(arr[mid], arr[mid + 1], target);
      }
      start = mid + 1;
    }
  }

  return arr[mid];
}

/**
 * Finds the closest timestamp
 * return the object.
 *
 * @param a log object
 *
 * @param b log object
 *
 * @param target timestamp
 *
 */
function getClosest(a: Content, b: Content, target: number): Content {
  if (target - a?.timestamp >= b?.timestamp - target) {
    return b;
  } else {
    return a;
  }
}

/**
 * Transforms robot array to required obj shape
 * excludes robot 0
 *
 * @param robots - array of numbers
 *
 * @returns Array of object
 *
 * @example
 *    robots = [0, 3]
 *      // => [{label: 'robot 3', value: 3}]
 */
export const transformRobots = (robots: Array<number>) => {
  const robotArr: Array<{ label: string; value: number }> = [];
  robots.forEach((robot) => {
    if (robot !== 0) {
      robotArr.push({ label: `robot ${robot}`, value: robot });
    }
  });
  return robotArr;
};

/**
 * Finds the currentIndex of log entry matched
 * from timestamp.
 *
 * @param currentMarker
 *
 * @param data
 *
 * @returns index
 *
 */
export const getCurrIndex = (currentMarker: number, data: LogFile) => {
  return new Promise<number>((resolve, _) => {
    let closest = findClosest(currentMarker, data.content);
    let currIndex = data.content?.findIndex(
      (x) => x.timestamp === closest?.timestamp,
    );
    currIndex = currIndex > 0 ? currIndex : 0;
    resolve(currIndex);
  });
};

/**
 * Transform services and
 * sorts alphabetically then numerically (ascending order)
 *
 * @param {array} services array of objects
 *
 * @returns {array} Array of objects
 */
export const sortServices = (services: Array<Service>) => {
  let servicesArr = services.map((x) => {
    return { ...x, display: `${x.service}.${x.robot}` };
  });
  return servicesArr.sort((a, b) =>
    a.display > b.display ? 1 : b.display > a.display ? -1 : 0,
  );
};

/**
 * Get unique video categories for the 3 video types
 * i. "Robot",
 * ii. "Workcell right",
 * iii. "Workcell left"
 *
 * @param categories array of objects
 *
 * @returns Array of video object
 */
export const uniqueVideoTabs = (categories: Array<Video>) => {
  let key = "category";
  let arrayUniqueByKey = [
    ...new Map(
      categories.map((item) => [item[key as keyof Video], item]),
    ).values(),
  ];
  return arrayUniqueByKey;
};

/**
 * Finds and return index of the log else returns 0
 *
 * @param content array of objects
 *
 * @param obj - log object
 *
 * @returns Index
 */
export const findLogIndex = (content: Array<Content> = [], obj: Content) => {
  let objIndex = content.findIndex((item) => item.timestamp === obj?.timestamp);
  return objIndex > 0 ? objIndex : 0;
};

/**
 * Match pattern for log message
 *
 * @param message
 * @param ext
 * @returns log object
 */
export const logContent = (message: string = "", ext: string = ".log") => {
  let log: Record<string, any> = {};
  let splittedArr: string[];

  if (ext === ".log") {
    let wholeMatch = message.match(LOG_STR_PATTERN);
    if (wholeMatch) {
      splittedArr = wholeMatch[0].split(" ");
      log["timestamp"] = splittedArr[0].replace("[", "").replace("]", "");
      log["log_level"] = splittedArr[1].replace("[", "").replace("]", "");
      log["service"] = splittedArr[2].replace("[", "").replace("]", "");
    }
    splittedArr = message.split("-- ");
    if (splittedArr.length > 2) {
      splittedArr.shift();
      log["log"] = `-- ${splittedArr.join(" ")}`;
    } else {
      log["log"] = `-- ${splittedArr[1]}`;
    }
  } else if (ext === ".dump") {
    splittedArr = message.split("  ");
    log["timestamp"] = splittedArr[0].replace("[", "").replace("]", "");
    log["log_level"] = splittedArr[1];
    log["service"] = splittedArr[2];
    log["log"] = splittedArr[3];
  }
  return log;
};

/**
 * Filters out comma separated strings
 * and return combined set array of filters
 * @param str
 * @param content
 * @returns
 */
export const logFilter = (str: string, content: Array<Content> = []) => {
  const splitStr = str.split(",").map((s) => s.toLowerCase().trim());
  const filteredArr = splitStr.reduce<Array<Content>>((acc, curr) => {
    const filtered = content.filter((obj) =>
      obj.log_message.toLowerCase().includes(curr),
    );
    return filtered.length > 0 ? [...acc, ...filtered] : acc;
  }, []);

  return [...new Set(filteredArr)];
};

/**
 * Transform job types options
 * @param jobtypes
 * @returns
 */
export const transformJobTypeOptions = (jobtypes: Array<JobType>) => {
  return jobtypes.map((jobtype) => {
    return { value: jobtype.name, label: jobtype.name };
  });
};

/**
 * Transform job schema options
 * @param jobschemas
 * @returns
 */
export const transformJobSchemaOptions = (jobschemas: Array<JobSchema>) => {
  return jobschemas.map((schema) => {
    return { value: schema.version, label: `version ${schema.version}` };
  });
};

export const getUrl = (url: string): string => {
  let pattern = /jobresults\/(?:&?[^=&]*=[^=&]*)*/;
  let match = url.match(pattern);
  return match ? match[0] : "";
};

export const getHarvId = (url: string, target: number = 1): string | number => {
  let pattern = /job__target__harv_id=[0-9]+/;
  let match = url.match(pattern);
  if (match) {
    return match[0].split("=")[1];
  } else {
    return target;
  }
};

export const statusOptions = [
  { label: "Success", value: "Success" },
  { label: "Failed", value: "Failed" },
  { label: "Pending", value: "Pending" },
  { label: "Error", value: "Error" },
  { label: "Failed and errors", value: "Failed and errors" },
  { label: "Failed to send", value: "Failed to send" },
];

/**
 * Use https protocal when in production.
 *
 * @param url
 * @description some url are passed dynamically
 * without using the https protocal. This utils
 * methods allows us to enforce https when in production.
 */
export const enforceHttps = (url: string): string => {
  const newurl = new URL(url);
  if (import.meta.env.PROD) {
    newurl.protocol = "https:";
  }
  return newurl.href;
};

/**
 * Transform tags into required shape
 * @param tags
 * @param self
 * @returns
 */
export const transformTags = (tags: Array<string>, self: boolean = false) => {
  if (self) {
    return tags.map((tag) => {
      return { id: uuid(), name: tag, checked: true };
    });
  } else {
    return tags.map((tag) => {
      return { id: uuid(), name: tag, checked: false };
    });
  }
};

/**
 * Get unique values for the given array of objects
 * @param key
 * @param data
 * @returns
 */
export const uniqueValues = (
  key: string,
  data: Array<Record<string, any>> = [],
) => {
  return [...new Set(data.map((item) => item[key]))];
};

/**
 * Sort array by month names. Any item not member of the
 * monthorder comes last in the sorted array.
 * @param data
 * @returns
 */
export const sortByMonth = (data: Array<ResultReport>) => {
  const monthOrder = [
    "nov",
    "dec",
    "jan",
    "feb",
    "mar",
    "apr",
    "may",
    "jun",
    "jul",
    "aug",
    "sep",
    "oct",
  ];

  const monthMap: { [key: string]: number } = {};
  monthOrder.forEach((month, index) => {
    monthMap[month.toLowerCase()] = index;
  });

  data.sort((a, b) => {
    const monthA = a.date.toLowerCase();
    const monthB = b.date.toLowerCase();

    if (monthMap.hasOwnProperty(monthA) && monthMap.hasOwnProperty(monthB)) {
      return monthMap[monthA] - monthMap[monthB];
    } else if (monthMap.hasOwnProperty(monthA)) {
      return -1; // a comes before b
    } else if (monthMap.hasOwnProperty(monthB)) {
      return 1; // b comes before a
    } else {
      return 0; // no change in order for unknown months
    }
  });
  return data;
};

/**
 * Group by data by weeks
 * @param results
 * @returns
 */
export const groupByWeek = (results: Array<ResultReport>) => {
  return results.reduce<{ [key: string]: Array<ResultReport> }>((acc, item) => {
    if (!acc[item.reportTime]) {
      acc[item.reportTime] = [];
    }

    acc[item.reportTime].push({
      ...item,
    });

    return acc;
  }, {});
};

/**
 * Implements the merge sort algorithm
 * @param data
 * @returns
 */
export function mergeSort(data: Array<TraceObj>) {
  if (data.length <= 1) {
    return data;
  }

  const mid = Math.floor(data.length / 2);
  const left: Array<TraceObj> = mergeSort(data.slice(0, mid));
  const right: Array<TraceObj> = mergeSort(data.slice(mid));

  return merge(left, right);
}

/**
 * Merge sort recursive function
 * @param left
 * @param right
 * @returns
 */
function merge(left: Array<TraceObj>, right: Array<TraceObj>) {
  const merged: Array<TraceObj> = [];
  let leftIdx = 0;
  let rightIdx = 0;

  while (leftIdx < left.length && rightIdx < right.length) {
    if (left[leftIdx].x.length > right[rightIdx].x.length) {
      merged.push(left[leftIdx]);
      leftIdx++;
    } else {
      merged.push(right[rightIdx]);
      rightIdx++;
    }
  }
  return merged.concat(left.slice(leftIdx), right.slice(rightIdx));
}

/**
 * Compute aggregates for traces
 * @param aggregate
 * @param results
 * @returns
 */
export const mapTraces = (
  aggregate: string,
  resultObj: Record<string, Array<ResultReport>> = {},
) => {
  const tracesArr: Array<TraceObj> = [];

  for (const key in resultObj) {
    if (Object.hasOwnProperty.call(resultObj, key)) {
      let x: Array<string> = [];
      let y: Array<number> = [];
      let error_y: Array<number> = [];
      const obj: TraceObj = resultObj[key].reduce(
        (acc, item) => {
          x.push(item.date);
          if (aggregate === "picks_per_hour") {
            y.push(item.picks_per_hour);
            error_y.push(item.picks_per_hour_std);
          } else if (aggregate === "thoroughness") {
            y.push(item.thoroughness);
            error_y.push(item.thoroughness_percentage_std);
          } else if (aggregate === "grip_success") {
            y.push(item.grip_success);
            error_y.push(item.grip_success_percentage_std);
          } else {
            y.push(item.pick_success);
            error_y.push(item.pick_success_percentage_std);
          }
          acc["x"] = x;
          acc["y"] = y;
          acc["type"] = "line";
          acc["mode"] = "lines+markers";
          acc["jitter"] = 1;
          acc["error_y"] = {
            type: "data",
            array: error_y,
            visible: true,
          };
          return acc;
        },
        {
          x: [],
          y: [],
          error_y: {
            type: "",
            array: [],
            visible: false,
          },
          type: "",
          mode: "",
          jitter: 0,
          name: "",
        } as TraceObj,
      );
      // reset x, y and error_y
      x = [];
      y = [];
      error_y = [];
      obj["name"] = key;
      tracesArr.push(obj);
    }
  }
  return tracesArr;
};

/**
 * Group by data by hostname
 * @param results
 * @returns
 */
export const groupByHostName = (results: Array<ResultReportAddOn>) => {
  return results.reduce<{ [key: string]: Array<ResultReportAddOn> }>(
    (acc, item) => {
      if (!acc[item.report.data.hostname]) {
        acc[item.report.data.hostname] = [];
      }

      acc[item.report.data.hostname].push({
        ...item,
      });

      return acc;
    },
    {},
  );
};

/**
 * Compute aggregate for series traces
 * @param aggregate
 * @param resultObj
 * @returns
 */
export const mapSeriesTraces = (
  aggregate: string,
  resultObj: Record<string, Array<ResultReportAddOn>> = {},
) => {
  const tracesArr: Array<SeriesTrace> = [];

  const targetfps = (fps?: string) => {
    return fps ? `target fps: ${fps}` : "";
  };
  const avgfps = (fps?: string) => {
    return fps ? `avg fps: ${fps}` : "";
  };

  for (const key in resultObj) {
    if (Object.hasOwnProperty.call(resultObj, key)) {
      let x: Array<string> = [];
      let y: Array<number> = [];
      let text: Array<string> = [];
      const obj: SeriesTrace = resultObj[key].reduce(
        (acc, item) => {
          x.push(item.reportTime);
          text.push(
            `${item.tags.join(", ")} \n hostname: ${
              item.report.data.hostname
            } ${targetfps(item.report.data.target_fps)} ${avgfps(
              item.report.data.avg_fps,
            )}`,
          );
          if (aggregate === "picks_per_hour") {
            y.push(item.picks_per_hour);
          } else if (aggregate === "thoroughness") {
            y.push(item.thoroughness);
          } else if (aggregate === "grip_success") {
            y.push(item.grip_success);
          } else {
            y.push(item.pick_success);
          }
          acc["x"] = x;
          acc["y"] = y;
          acc["type"] = "scatter";
          acc["mode"] = "markers";
          acc["text"] = text;
          return acc;
        },
        {
          x: [],
          y: [],
          text: [],
          type: "",
          mode: "",
          name: "",
        } as SeriesTrace,
      );
      // reset x, y and text
      x = [];
      y = [];
      text = [];
      obj["name"] = key;
      tracesArr.push(obj);
    }
  }
  return tracesArr;
};

export const createBarData = (brkdwnDict: Breakdown): [string[], number[]] => {
  const data: { key: string; count: number }[] = [];
  for (const [key, value] of Object.entries(brkdwnDict || {})) {
    data.push({ key, count: value.count });
  }
  data.sort((a, b) => b.count - a.count);
  const keys = data.map((entry) => entry.key);
  const counts = data.map((entry) => entry.count);
  return [keys, counts];
};
