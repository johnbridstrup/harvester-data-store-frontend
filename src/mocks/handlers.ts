/**
 * Defines the mock handlers for api requests
 */

import {
  generatePareto,
  getErrorReport,
  getEvent,
  getPickSession,
  getS3File,
  login,
  queryDistributor,
  queryErrorReport,
  queryExceptionCode,
  queryFruit,
  queryEvent,
  queryLocation,
  queryNotification,
  queryPickSession,
  queryS3File,
  queryUser,
  queryHarvester,
  getHarvester,
  queryHarvesterHistory,
  getHarvesterHistory,
  queryHarvesterVersion,
  queryMigrationLog,
  getMigrationLog,
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
  queryPickSession,
  getPickSession,
  queryHarvester,
  getHarvester,
  queryHarvesterHistory,
  getHarvesterHistory,
  queryHarvesterVersion,
  queryMigrationLog,
  getMigrationLog,
];

export default handlers;
