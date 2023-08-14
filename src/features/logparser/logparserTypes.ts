import { CommonState } from "../base/types";

export interface Service {
  id: number;
  service: string;
  robot: number;
  display?: string;
}

export interface Video {
  id: number;
  category: string;
  robot: number;
}

interface Search {
  searchText: string | null;
  content: Array<Content>;
  currentIndex: number | null;
  countIndex: number;
}

export interface Internal {
  harv_id: number | null;
  services: Array<Service>;
  robots: Array<number>;
  videos: Array<Video>;
  search: Search;
}

interface Logs {
  harv_id: number | null;
  robots: Array<number>;
  services: Array<Service>;
  videos: Array<Video>;
}

export interface Meta {
  ts: number;
  index: number;
}

export interface LogVideo {
  id: number;
  video_avi: string;
  created: string;
  lastModified: string;
  file_name: string;
  robot: number;
  category: string;
  meta: Array<Meta>;
  creator: number;
  modifiedBy: number | null;
  log_session: number;
  _video_avi: number;
}

export interface LogSession {
  id: number;
  tags: Array<string>;
  created: string;
  lastModified: string;
  name: string;
  date_time: string;
  creator: number;
  modifiedBy: number | null;
  harv: number | null;
  _zip_file: number | null;
  logs: Logs;
}

type LogSessionOmit = Omit<LogSession, "logs">;

export interface Content {
  robot: number;
  service: string;
  log_date: string;
  timestamp: number;
  log_message: string;
  logfile_type: string;
}

export interface LogFile {
  id: number;
  log_session: LogSessionOmit;
  created: string;
  lastModified: string;
  file_name: string;
  service: string;
  robot: number;
  content: Array<Content>;
  creator: number;
  modifiedBy: number | null;
}

export interface LogParserState extends CommonState {
  uploading: boolean;
  logsessions: Array<LogSession>;
  logsession: LogSession | null;
  logfile: LogFile | null;
  oglogfile: LogFile | null;
  logvideo: LogVideo | null;
  currentMarker: number | null;
  currentIndex: number | null;
  internal: Internal;
}
