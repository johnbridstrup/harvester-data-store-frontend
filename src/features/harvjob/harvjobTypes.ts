import {
  CommonState,
  Creator,
  HarvesterMinimal,
  LocationMinimal,
} from "../base/types";
import { EventObj } from "../event/eventTypes";

export interface JobType {
  id: number;
  created: string;
  lastModified: string;
  name: string;
  creator: number;
  modifiedBy: number | null;
}

export interface JobSchema {
  id: number;
  created: string;
  lastModified: string;
  schema: Record<string, any>;
  version: string;
  comment: string;
  creator: number;
  modifiedBy: number | null;
  jobtype: string;
}

export interface Job {
  id: number;
  event: EventObj;
  schema: JobSchema;
  target: HarvesterMinimal;
  creator: Creator;
  modifiedBy: Creator | null;
  created: string;
  lastModified: string;
  payload: Record<string, any>;
  jobstatus: string;
  results: string;
  history: string;
}

interface Detail {
  ts: number;
  exit_code: number;
  stdout: string;
  stderr: string;
  status: string;
}

export interface HostResult {
  id: number;
  created: string;
  lastModified: string;
  host: string;
  result: string;
  details: Detail;
  timestamp: string;
  creator: number;
  modifiedBy: number | null;
  parent: number;
}

interface Report {
  type: string;
  timestamp: number;
  uuid: string;
  data: Record<string, any>;
  serial_number: string;
}

export interface JobResult {
  id: number;
  host_results: Array<HostResult>;
  event: EventObj;
  creator: Creator;
  modifiedBy: Creator | null;
  created: string;
  lastModified: string;
  reportTime: string;
  report: Report;
  location: LocationMinimal | null;
  harvester: HarvesterMinimal | null;
  job: number;
}

export interface JobStatus {
  jobstatus: string;
  history_id: number;
  history_date: string;
}

interface Internal {
  schema?: { label: string; value: string };
  jtype?: { label: string; value: string };
  cacheSchemaOptions?: { label: string; value: string }[];
}

export interface HarvJobState extends CommonState {
  adding: boolean;
  editting: boolean;
  jobtypes: Array<JobType>;
  jobtype: JobType | null;
  jobschemas: Array<JobSchema>;
  jobschema: JobSchema | null;
  jobs: Array<Job>;
  job: Job | null;
  jobresults: Array<JobResult>;
  jobresult: JobResult | null;
  jobstatuses: Array<JobStatus>;
  internal: Internal;
}
