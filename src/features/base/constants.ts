/**
 * Module for constants and enum types
 * @module constants
 */

const API_PORT = (import.meta.env.REACT_APP_HDS_PORT as string) || 8085;
const API_VERSION = "v1";

export const API_BASE_URL =
  (import.meta.env.REACT_APP_HDS_API_URL as string) ||
  `http://localhost:${API_PORT}`;
export const API_URL = `${API_BASE_URL}/api/${API_VERSION}`;
export const CSRF_URL = `${API_URL}/users/csrf/`;
export const OPENAPI_URL = `${API_URL}/openapi?format=openapi-json`;
export const MAX_LIMIT = 10000;
export const PROD_ENV = "production";
export const SUCCESS = "success";
export const MASTER_ROBOT = 0;
export const ERRORREPORT_TRIGGER = "ErrorReport";
export const LOG_STR_PATTERN =
  /^\[([0-9]{8}T[0-9]{6}.[0-9]{3})\] \[([A-Z]+)\] \[([a-zA-Z0-9(_.\s)?]+)\]/;
export const LOG_MSG_PATTERN =
  /-- [A-Za-z0-9(:\s.,<>?_\t\n{}[\]/'"~`!@#$%^&*()-+=)?]+/i;

export enum status {
  HTTP_401_UNAUTHORIZED = "Request failed with status code 401",
  HTTP_403_FORBIDDEN = "Request failed with status code 403",
}

export enum NOTIFY_CATEGORY {
  created = "created",
  isRecipient = "is_recipient",
}

export enum FULLFILLED_PROMISE {
  auth = "auth/login/fulfilled",
  notification = "notification/deleteNotification/fulfilled",
  logout = "auth/logout/fulfilled",
  migration = "migration/execMigration/fulfilled",
  aftconfig = "aftconfig/fullConfigReport/fulfilled",
  s3file = "s3file/deleteS3File/fulfilled",
  jobtypeschema = "jobscheduler/getJobTypeSchema/fulfilled",
  schedulejob = "jobscheduler/createScheduledJob/fulfilled",
}

export enum REJECTED_PROMISE {
  notification = "notification/deleteNotification/rejected",
  password = "auth/changePassword/rejected",
  profile = "auth/updateProfile/rejected",
  confirm = "auth/confirmPassword/rejected",
  migration = "migration/execMigration/rejected",
  aftconfig = "aftconfig/fullConfigReport/rejected",
  s3file = "s3file/deleteS3File/rejected",
  jobtypeschema = "jobscheduler/getJobTypeSchema/rejected",
  schedulejob = "jobscheduler/createScheduledJob/rejected",
}

export enum LOG_LEVEL {
  DEBUG = "DEBUG",
  WARNING = "WARNING",
  ERROR = "ERROR",
  CRITICAL = "CRITICAL",
  INFO = "INFO",
}

export enum THEME_MODES {
  AUTO_THEME = "auto",
  LIGHT_THEME = "light",
  DARK_THEME = "dark",
}

export enum PushStateEnum {
  GENPARETO = "genpareto",
  BUILDCHART = "buildchart",
  RELEASECODE = "releasecode",
  EVENTS = "events",
  PICKSESSIONS = "picksessions",
  JOBS = "jobs",
  S3FILES = "s3files",
  AUTODIAGNOSTICS = "autodiagnostics",
  EMULATORSTATS = "emulatorstats",
}
