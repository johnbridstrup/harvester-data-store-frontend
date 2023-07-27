import { CommonState } from "../base/types";
import { Distributor } from "../distributor/distributorTypes";

interface Creator {
  id: number;
  username: string;
}

export interface LocationObj {
  id: number;
  distributor: Distributor;
  creator: Creator;
  modifiedBy: Creator | null;
  created: string;
  lastModified: string | null;
  ranch: string;
  country: string;
  region: string;
  site_channel: string;
}

export interface LocationState extends CommonState {
  adding: boolean;
  editting: boolean;
  location: LocationObj | null;
  locations: Array<LocationObj>;
}
