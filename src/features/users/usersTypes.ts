import { User } from "../auth/authTypes";
import { CommonState } from "../base/types";

export interface UserState extends CommonState {
  adding: boolean;
  editting: boolean;
  user: User | null;
  users: Array<User>;
}
