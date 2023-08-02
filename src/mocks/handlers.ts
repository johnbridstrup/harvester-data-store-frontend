/**
 * Defines the mock handlers for api requests
 */

import {
  generatePareto,
  getErrorReport,
  getEvent,
  getS3File,
  login,
  queryDistributor,
  queryErrorReport,
  queryExceptionCode,
  queryFruit,
  queryEvent,
  queryLocation,
  queryNotification,
  queryS3File,
  queryUser,
} from "./actions";

const handlers = [
  login,
  queryNotification,
  queryS3File,
  getS3File,
  queryDistributor,
  queryLocation,
  queryErrorReport,
  getErrorReport,
  queryExceptionCode,
  queryFruit,
  generatePareto,
  queryUser,
  queryEvent,
  getEvent,
];

export default handlers;
