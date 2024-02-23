import { CommonState, HarvesterMinimal } from "../base/types";
import { Job } from "../harvjob/harvjobTypes";

interface IntervalSchedule {
  id: number;
  every: number;
  period: string;
}

interface ClockedSchedule {
  id: number;
  clocked_time: string;
}

interface CrontabSchedule {
  id: number;
  minute: string;
  hour: string;
  day_of_week: string;
  day_of_month: string;
  month_of_year: string;
  timezone: string;
}

interface SolarSchedule {
  event: string;
  latitude: string;
  longitude: string;
}

interface PeriodicTask {
  id: number;
  interval: IntervalSchedule | null;
  crontab: CrontabSchedule | null;
  clocked: ClockedSchedule | null;
  name: string;
  task: string;
  args: string;
  kwargs: string;
  queue: string | null;
  exchange: string | null;
  routing_key: string | null;
  headers: string;
  priority: number | null;
  expires: string | null;
  expire_seconds: number | null;
  one_off: boolean;
  start_time: string | null;
  enabled: boolean;
  last_run_at: string | null;
  total_run_count: number;
  date_changed: string;
  description: string;
  solar: SolarSchedule | null;
}

export interface ScheduledJob {
  id: number;
  task: PeriodicTask;
  jobs: Array<Job>;
  created: string;
  lastModified: string;
  job_def: Record<string, any>;
  schedule_status: string;
  creator: number;
  modifiedBy: number | null;
  targets: Array<HarvesterMinimal>;
}

interface Form {
  type: string;
  title: string;
  required: string[];
  properties: Record<string, Record<string, any>>;
}

export interface IntervalData {
  every: number;
  period: string;
}

export interface CrontabData {
  timezone: string;
  minute: string;
  hour: string;
  day_of_week: string;
  day_of_month: string;
  month_of_year: string;
}

export interface ClockedData {
  clocked_time: string;
}

export interface ScheduleData {
  jobtype: string;
  schema_version: string;
  max_runs: number;
  schedule: {
    interval?: IntervalData;
    crontab?: CrontabData;
    clocked?: ClockedData;
  };
  targets: {
    ranches?: string[];
    harvesters?: string[];
    fruits?: string[];
    all?: boolean;
  };
  payload: {
    payload: Record<string, any>;
  };
}

export enum ScheduleStepForm {
  "StaticForm" = "StaticForm",
  "DynamicForm" = "DynamicForm",
}

export enum ScheduleCase {
  Interval = "Interval",
  Crontab = "Crontab",
  Clocked = "Clocked",
}

export enum TargetCase {
  Ranch = "Ranch",
  Harvester = "Harvester",
  Fruit = "Fruit",
  Fleet = "Fleet",
}

export interface FormBuilder {
  form: Form;
  submit: string;
}

interface JobTypeSchema {
  jobs: Record<string, any>;
}

export interface JobSchedulerState extends CommonState {
  creating: boolean;
  patching: boolean;
  scheduledjobs: Array<ScheduledJob>;
  scheduledjob: ScheduledJob | null;
  jobtypeschema: JobTypeSchema | null;
  formbuilder: FormBuilder;
}
