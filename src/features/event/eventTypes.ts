import { CommonState, Creator } from "../base/types";

interface RelatedObj {
  url: string;
  object: string;
}

interface RelatedFile {
  url: string;
  filetype: string;
}

export interface EventObj {
  id: number;
  tags: Array<string>;
  created: string;
  lastModified: string | null;
  UUID: string;
  creator: Creator;
  modifiedBy: Creator | null;
  secondary_events: Array<string>;
  related_objects: Array<RelatedObj>;
  related_files: Array<RelatedFile>;
  related_images: Array<RelatedFile>;
}

export interface PickSession extends EventObj {}

export interface EventState extends CommonState {
  picksession: PickSession | null;
  picksessions: Array<PickSession>;
  tags: Array<string>;
  event: EventObj | null;
  events: Array<EventObj>;
}
