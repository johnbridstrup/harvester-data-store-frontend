import { CommonState, Creator } from "../base/types";

export interface Distributor {
  id: number;
  creator: Creator;
  modifiedBy: Creator | null;
  created: string;
  lastModified: string | null;
  name: string;
}

export interface DistributorState extends CommonState {
  adding: boolean;
  editting: boolean;
  distributor: Distributor | null;
  distributors: Array<Distributor>;
}
