import { CommonState } from "../base/types";

interface Report {
  type: string;
  timestamp: number;
  data: Record<string, any>;
  serial_number: string;
  is_emulator: boolean;
  uuid: string;
  fruit: string;
}

export interface AFTConfig {
  id: number;
  created: string;
  lastModified: string | null;
  reportTime: string;
  report: Report;
  creator: number;
  modifiedBy: number | null;
  location: number;
  harvester: number;
  event: number;
}

interface Transformation {
  configs: Record<string, any>;
  errored: boolean;
}

export interface AFTConfigState extends CommonState {
  aftconfig: AFTConfig | null;
  configkeys: Array<string>;
  transformed: Transformation;
}
