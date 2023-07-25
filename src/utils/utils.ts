/**
 * Module for Utility Functions
 * @module utils
 */

import { PushStateEnum, THEME_MODES } from "@/features/base/constants";

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
  const handleSelect = (
    newValue: { label: string; value: string },
    actionMeta: { action: string; name: string; option: undefined },
  ) => {
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
