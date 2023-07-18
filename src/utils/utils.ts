/**
 * Module for Utility Functions
 * @module utils
 */

import { THEME_MODES } from "@/features/base/constants";

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
  const result: Record<string, string | number> = {};
  for (const [key, value] of urlparams.entries()) {
    result[key] = value;
  }
  return result;
};
