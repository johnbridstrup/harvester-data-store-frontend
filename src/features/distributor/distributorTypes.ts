import { Pagination } from "../base/types";

interface Creator {
  id: number;
  username: string;
}

export interface Distributor {
  id: number;
  creator: Creator;
  modifiedBy: Creator | null;
  created: string;
  lastModified: string | null;
  name: string;
}

export interface DistributorState {
  loading: boolean;
  adding: boolean;
  editting: boolean;
  distributor: Distributor | null;
  distributors: Array<Distributor>;
  errorMsg: string | null | unknown;
  pagination: Pagination;
}
