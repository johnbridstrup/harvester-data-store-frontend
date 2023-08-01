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
];

export default handlers;
