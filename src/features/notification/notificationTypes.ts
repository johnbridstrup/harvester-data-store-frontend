import { Pagination } from "../base/types";

interface Recipient {
  username: string;
}

interface Creator {
  id: number;
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

export interface NotificationState {
  loading: boolean;
  notification: Notification | null;
  notifications: Array<Notification>;
  errorMsg: null | unknown;
  pagination: Pagination;
}
