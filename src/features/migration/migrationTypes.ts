import { CommonState } from "../base/types";

export interface Migration {
  id: number;
  created: string;
  lastModified: string;
  result: string;
  startTime: string;
  endTime: string;
  output: string;
  githash: string;
  creator: number;
  modifiedBy: number | null;
}

export interface MigrationState extends CommonState {
  queueing: boolean;
  migrations: Array<Migration>;
  migration: Migration | null;
}
