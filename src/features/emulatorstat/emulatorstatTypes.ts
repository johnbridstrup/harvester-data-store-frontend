import { CommonState } from "../base/types";

interface Report {
  type: string;
  timestamp: number;
  data: Record<string, any>;
  serial_number: number;
  is_emulator: boolean;
  fruit: string;
}

export interface EmulatorStatReport {
  id: number;
  tags: Array<string>;
  created: string;
  lastModified: string;
  reportTime: string;
  report: Report;
  scene: string;
  branch: string;
  date: string;
  runner: string;
  elapsed_seconds: number;
  mm_traveled: number;
  num_grip_attempts: number;
  grip_success_percentage: number;
  num_pick_attempts: number;
  pick_success_percentage: number;
  thoroughness_percentage: number;
  detection_success_percentage: number;
  num_cand_overlaps: number;
  rmse_localization_mm: number;
  num_fruit_collisions: number;
  num_leaf_collisions: number;
  num_bed_collisions: number;
  num_pick_cands: number;
  num_no_pick_cands: number;
  num_false_ripe: number;
  num_false_unripe: number;
  avg_ripeness_pick: number;
  avg_ripeness_no_pick: number | null;
  total_targets: number;
  creator: number;
  modifiedBy: number | null;
  location: number;
  harvester: number;
  event: number;
  pick_session: number | null;
}

export interface ResultReport {
  reportTime: string;
  date: string;
  num_picks_sum: number;
  num_grips_sum: number;
  num_targets_sum: number;
  elapsed_hours_sum: number;
  num_pick_attempts_sum: number;
  num_grip_attempts_sum: number;
  picks_per_hour_std: number;
  pick_success_percentage_std: number;
  grip_success_percentage_std: number;
  thoroughness_percentage_std: number;
  picks_per_hour: number;
  thoroughness: number;
  grip_success: number;
  pick_success: number;
}

export interface ResultReportAddOn extends ResultReport {
  report: Report;
  tags: Array<string>;
}

export interface TraceObj {
  x: Array<string>;
  y: Array<number>;
  error_y: {
    type: string;
    array: Array<number>;
    visible: boolean;
  };
  type: string;
  mode: string;
  jitter: number;
  name: string;
}

export interface SeriesTrace {
  x: Array<string>;
  y: Array<number>;
  text: Array<string>;
  type: string;
  mode: string;
  name: string;
}

export enum ActionTypesEnum {
  ON_MOUNT = "ON_MOUNT",
  ON_DATE_PICKED = "ON_DATE_PICKED",
}

export interface EmulatorstatState extends CommonState {
  emustats: Array<EmulatorStatReport>;
  emustatsObj: EmulatorStatReport | null;
  tags: Array<string>;
}
