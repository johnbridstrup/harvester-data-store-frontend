/**
 * Defines the mock handlers for api requests
 */

import {
  getS3File,
  login,
  queryDistributor,
  queryNotification,
  queryS3File,
} from "./actions";

const handlers = [
  login,
  queryNotification,
  queryS3File,
  getS3File,
  queryDistributor,
];

export default handlers;
