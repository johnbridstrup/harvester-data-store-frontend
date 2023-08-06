import { CommonState } from "../base/types";

export interface Fruit {
  id: number;
  created: string;
  lastModified: string | null;
  name: string;
  creator: number;
  modifiedBy: number | null;
}

export interface HarvesterState extends CommonState {
  fruits: Array<Fruit>;
  fruit: Fruit | null;
}
