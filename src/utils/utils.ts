/**
 * Module for Utility Functions
 * @module utils
 */

import { MultiValue } from "react-select";
import {
  API_URL,
  MASTER_ROBOT,
  PushStateEnum,
  THEME_MODES,
} from "@/features/base/constants";
import {
  Exception,
  ExceptionCode,
  TransformException,
} from "@/features/exception/exceptionTypes";
import {
  ParamsString,
  QueryObject,
} from "@/components/errorreport/ErrorHelpers";
import { Fruit } from "@/features/harvester/harvesterTypes";
import { User } from "@/features/auth/authTypes";
import {
  ErrorReportArray,
  ErroredService,
  SysmonKey,
  TransformErrorReport,
} from "@/features/errorreport/errorreportTypes";

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
 * Push URL onto the browser back stack
 * @param {object} queryObj
 * @param {String} pareto
 */
export const pushState = (queryObj: Record<string, any>, pareto?: string) => {
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
  } else {
    newurl = `${window.location.protocol}//${
      window.location.host
    }/errorreports/?${params.toString()}`;
  }
  window.history.pushState({ path: newurl }, "", newurl);
};

/**
 * An abstract function to implement handle select state
 * @param {Function} setSelectedFunc
 * @returns Function
 */
export function handleSelectFactory(setSelectedFunc: Function) {
  const handleSelect = (newValue: MultiValue<undefined>) => {
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
 * @param {object} fieldData
 * @param {Array} selectedHarvId
 * @param {Array} selectedLocation
 * @param {object} selectedTimezone
 * @param {Array} selectedFruit
 * @param {Array} selectedCode
 * @returns
 */
export const buildQueryObj = (
  fieldData: any,
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
  return queryObj;
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
