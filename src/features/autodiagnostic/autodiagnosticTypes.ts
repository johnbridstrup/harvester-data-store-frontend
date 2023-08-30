import {
  CommonState,
  Creator,
  HarvesterMinimal,
  LocationMinimal,
} from "../base/types";
import { EventObj, PickSession } from "../event/eventTypes";

export interface SensorData {
  state: string;
  ts: number;
  value: number;
}

export interface SensorArrays {
  touch: SensorData[];
  vacuum: SensorData[];
  finger: SensorData[];
}

export interface TsInterval {
  state: string;
  x0: number;
  x1: number;
  diff: number;
  max: number;
  min: number;
}

export interface RevertedOgShapeResult {
  values: number[];
  states: string[];
  timestamps: number[];
  ts_interval: TsInterval[];
}

export interface Sensors {
  touch: RevertedOgShapeResult;
  vacuum: RevertedOgShapeResult;
  finger: RevertedOgShapeResult;
}

export interface SensorRaw {
  vac: number;
  touch: number;
  finger: number;
}

export type SensorEntry = [number, SensorRaw];

export type SensorObject = Record<string, SensorEntry[]>;

export interface RunData {
  id: number;
  created: string;
  lastModified: string;
  robot_id: number;
  run_timestamp: string;
  ball_found_result: boolean;
  result: boolean;
  template_match_result: boolean;
  min_vac: number;
  finger_open_value: number;
  finger_closed_value: number;
  finger_delta: number;
  nominal_touch_force: number;
  max_touch_force: number;
  template_match_y_error: number;
  sensors: Record<string, Array<Array<any>>>;
  creator: number;
  modifiedBy: number | null;
  report: number;
  gripper: number;
}

interface Report {
  type: string;
  timestamp: number;
  data: Record<string, any>;
  serial_number: number;
  uuid: string;
  pick_session_uuid: string;
  is_emulator: boolean;
  fruit: string;
}

export interface AutodiagReport {
  id: number;
  run_data: RunData;
  event: EventObj;
  pick_session: PickSession;
  harvester: HarvesterMinimal;
  location: LocationMinimal;
  creator: Creator;
  modifiedBy: Creator | null;
  created: string;
  lastModified: string;
  reportTime: string;
  report: Report;
  result: boolean;
  robot: number;
  gripper_sn: number;
}

type AutodiagReportOmit = Omit<
  AutodiagReport,
  | "run_data"
  | "event"
  | "pick_session"
  | "harvester"
  | "location"
  | "creator"
  | "modifiedBy"
>;

export interface AutodiagReportArray extends AutodiagReportOmit {
  event: number;
  pick_session: number;
  harvester: number;
  location: number;
  creator: number;
  modifiedBy: number | null;
}

export interface AutodiagnosticState extends CommonState {
  reports: Array<AutodiagReportArray>;
  report: AutodiagReport | null;
  sensors: Sensors;
}
