import {
  CommonState,
  Creator,
  HarvesterMinimal,
  LocationMinimal,
  RelatedObj,
} from "../base/types";
import { Exception, TransformException } from "../exception/exceptionTypes";
import { EventObj as EventObject } from "../event/eventTypes";

interface Hovered {
  type: string;
  obj: Record<string, any>;
}

interface Internal {
  hovered: Hovered | null;
  searchObj: Record<string, any> | null;
  service: string | null;
  timestamp: number | null;
  extrainfo: string;
}

type OmittedEvent = Omit<EventObject, "creator" | "modifiedBy">;

interface EventObj extends OmittedEvent {
  creator: number;
  modifiedBy: number | null;
}

interface Picksession {
  id: number;
  tags: Array<string>;
  harvester: HarvesterMinimal | null;
  location: LocationMinimal | null;
  creator: Creator;
  modifiedBy: Creator | null;
  created: string;
  lastModified: string | null;
  UUID: string;
  start_time: string | null;
  session_length: number | null;
  related_objects: Array<RelatedObj>;
}

interface Report {
  data: Record<string, any>;
  type: string;
  timestamp: number;
}

export interface ErrorReport {
  id: number;
  exceptions: Array<Exception>;
  tags: Array<string>;
  event: EventObj;
  pick_session: null;
  location: LocationMinimal;
  harvester: HarvesterMinimal;
  creator: Creator;
  modifiedBy: Creator | null;
  created: string;
  lastModified: string | null;
  reportTime: string;
  report: Report;
  githash: string;
  gitbranch: string;
}

export interface ErrorReportArray {
  id: number;
  exceptions: Array<Exception>;
  tags: Array<string>;
  event: number;
  location: LocationMinimal;
  harvester: HarvesterMinimal;
  reportTime: string;
  githash: string;
  gitbranch: string;
}

export interface TransformedErrorReportArray {
  reportId: number;
  created: string;
  lastModified: string;
  reportTime: string;
  creator: number;
  modifiedBy: number | null;
  location: LocationMinimal;
  harvester: HarvesterMinimal;
  timestamp: string;
  serial_number: number;
  githash: string;
  branch_name: string;
  exceptions: Array<Exception>;
  id: number;
  code: string;
  service: string;
  node: number;
  robot: number;
  traceback: string;
  info: string;
  handled: boolean;
  primary: boolean;
  report: number;
}

export interface TransformErrorReport {
  id: number;
  exceptions: Array<Exception>;
  tags: Array<string>;
  event: EventObj;
  pick_session: Picksession | null;
  location: LocationMinimal;
  harvester: HarvesterMinimal;
  creator: Creator;
  modifiedBy: Creator | null;
  created: string;
  lastModified: string;
  reportTime: string;
  report: Report;
  githash: string;
  gitbranch: string;
  service: string;
  code: string;
}

export interface ErroredService {
  service: string;
  robot: number;
}

export interface SysmonKey {
  robot: string;
  error: boolean;
  arm: string;
}

export interface Pareto {
  value: string;
  count: number;
}

interface Transformation {
  sysmonkeys: Array<SysmonKey>;
  sysmonreport: Record<string, any>;
  reportobj: TransformErrorReport | null;
  erroredservices: Array<ErroredService>;
  exceptions: Array<TransformException>;
}

export interface ErrorReportState extends CommonState {
  reports: Array<TransformedErrorReportArray>;
  report: ErrorReport | null;
  timezone: string | null;
  queryUrl: string | null;
  paretos: Array<Pareto>;
  transformed: Transformation;
  internal: Internal;
}
