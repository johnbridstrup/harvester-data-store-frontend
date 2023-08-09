import { CommonState, Creator } from "../base/types";
import {
  HarvesterCodeRelease,
  HarvesterCodeReleaseArray,
  HarvesterVersionReport,
} from "../harvdeploy/harvdeployTypes";
import { LocationObj } from "../location/locationTypes";

export interface Fruit {
  id: number;
  created: string;
  lastModified: string | null;
  name: string;
  creator: number;
  modifiedBy: number | null;
}

export interface HarvesterHistory {
  history_id: number;
  fruit: Fruit;
  location: LocationObj;
  release: HarvesterCodeRelease | null;
  id: number;
  created: string;
  lastModified: string | null;
  harv_id: number;
  name: string;
  is_emulator: boolean;
  thingName: string | null;
  history_date: string;
  history_change_reason: string | null;
  history_type: string;
  creator: number;
  modifiedBy: number | null;
  history_user: number;
}

export interface Harvester {
  id: number;
  fruit: Fruit;
  location: LocationObj;
  release: HarvesterCodeReleaseArray | null;
  creator: Creator;
  modifiedBy: Creator | null;
  created: string;
  lastModified: string;
  harv_id: number;
  name: string;
  is_emulator: boolean;
  thingName: string | null;
  harvester_history: string;
  version_history: string;
  assets: string;
  config: string;
  version: HarvesterVersionReport;
}

type OmittedObjects = Omit<Harvester, "release" | "version">;

export interface HarvesterArray extends OmittedObjects {
  release: number | null;
}

export interface HarvesterState extends CommonState {
  adding: boolean;
  editting: boolean;
  fruits: Array<Fruit>;
  fruit: Fruit | null;
  harvester: Harvester | null;
  harvesters: Array<HarvesterArray>;
  harvversion: Array<HarvesterVersionReport>;
  historys: Array<HarvesterHistory>;
  historyObj: HarvesterHistory | null;
}
