import { Creator, Pagination } from "../base/types";

interface RelatedObj {
  url: string;
  object: string;
}

interface RelatedFile {
  url: string;
  filetype: string;
}

interface Event {
  id: number;
  tags: Array<string>;
  created: string;
  lastModified: string;
  UUID: string;
  creator: number;
  modifiedBy: null;
  secondary_events: Array<string>;
  related_objects: Array<RelatedObj>;
  related_files: Array<RelatedFile>;
}

export interface S3File {
  id: number;
  event: Event;
  creator: Creator;
  modifiedBy: Creator | null;
  created: string;
  lastModified: string | null;
  file: string;
  filetype: string;
  key: string;
  deleted: false;
}

export interface S3FileState {
  loading: boolean;
  flagging: boolean;
  s3file: S3File | null;
  s3files: Array<S3File>;
  errorMsg: string | null | unknown;
  pagination: Pagination;
}
