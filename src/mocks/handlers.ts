/**
 * Defines the mock handlers for api requests
 */

import {
  generatePareto,
  getErrorReport,
  getS3File,
  login,
  queryDistributor,
  queryErrorReport,
  queryExceptionCode,
  queryFruit,
  queryLocation,
  queryNotification,
  queryS3File,
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
];

export default handlers;
