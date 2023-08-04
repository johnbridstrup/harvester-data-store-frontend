import { CommonState, HarvesterMinimal } from "../base/types";

export interface ExceptionCode {
  id: number;
  created: string;
  lastModified: string | null;
  code: number;
  name: string;
  msg: string;
  team: string;
  cycle: boolean;
  operator_msg: string;
  creator: number;
  modifiedBy: number | null;
  manifest: number | null;
}

export interface Exception {
  id: number;
  code: ExceptionCode;
  harvester: HarvesterMinimal;
  created: string;
  lastModified: string | null;
  service: string;
  node: number;
  robot: number;
  traceback: string;
  info: string;
  timestamp: string;
  handled: boolean;
  primary: boolean;
  creator: number;
  modifiedBy: number | null;
  report: number;
}

export interface TransformException extends Exception {
  exec_label: string;
}

export interface ExceptionState extends CommonState {
  exceptioncodes: Array<ExceptionCode>;
  exceptioncode: ExceptionCode | null;
}
