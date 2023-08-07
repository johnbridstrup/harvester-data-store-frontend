import { CommonState, Creator } from "../base/types";

interface Recipient {
  username: string;
}

export interface Notification {
  id: number;
  recipients: Array<Recipient>;
  creator: Creator;
  modifiedBy: Creator | null;
  created: string;
  lastModified: string;
  trigger_on: string;
  criteria: Record<string, any>;
}

export interface NotificationState extends CommonState {
  adding: boolean;
  notification: Notification | null;
  notifications: Array<Notification>;
}
