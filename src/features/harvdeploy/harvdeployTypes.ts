import { CommonState, Creator } from "../base/types";
import { Fruit, HarvesterArray } from "../harvester/harvesterTypes";

interface Report {
  type: string;
  data: Record<string, any>;
}

export interface HarvesterVersionReport {
  id: number;
  tags: Array<string>;
  created: string;
  lastModified: string;
  reportTime: string;
  report: Report;
  is_dirty: boolean;
  has_unexpected: boolean;
  creator: number;
  modifiedBy: number | null;
  location: number | null;
  harvester: number;
  conflicts: Record<string, any>;
}

export interface HarvesterCodeRelease {
  id: number;
  tags: Array<string>;
  fruit: Fruit;
  creator: Creator;
  modifiedBy: Creator | null;
  created: string;
  lastModified: string;
  version: string;
  release: Record<string, any>;
}

type OmittedRelease = Omit<HarvesterCodeRelease, "creator" | "modifiedBy">;
export interface HarvesterCodeReleaseArray extends OmittedRelease {
  creator: number;
  modifiedBy: number | null;
}

export interface HarvDeployState extends CommonState {
  editting: boolean;
  tags: Array<string>;
  harvversion: HarvesterVersionReport | null;
  harvversions: Array<HarvesterVersionReport>;
  harvrelease: HarvesterCodeRelease | null;
  harvreleases: Array<HarvesterCodeReleaseArray>;
  installed: Array<HarvesterArray>;
}
