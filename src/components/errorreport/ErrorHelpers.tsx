export interface ParamsString {
  harv_ids?: string;
  locations?: string;
  fruits?: string;
  codes?: string;
  traceback?: string;
  start_time?: string;
  end_time?: string;
  tz?: string;
  generic?: string;
  is_emulator?: string;
  handled?: string;
  primary?: string;
  group_by?: string;
}

export interface QueryObject {
  harv_ids?: Array<number>;
  locations?: Array<string>;
  fruits?: Array<string>;
  codes?: Array<number>;
  traceback?: string;
  start_time?: string;
  end_time?: string;
  tz?: string;
  generic?: string;
  is_emulator?: string;
  handled?: string;
  primary?: boolean;
  recipients?: Array<number>;
}
