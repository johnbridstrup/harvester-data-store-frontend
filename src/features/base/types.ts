export interface Pagination {
  next: string | null;
  previous: string | null;
  count: number;
  limit: number;
  offset: number;
}

export interface Creator {
  id: number;
  username: string;
}

export interface CommonState {
  loading: boolean;
  errorMsg: string | null | unknown;
  pagination: Pagination;
}

export interface RelatedObj {
  url: string;
  object: string;
}

export interface RelatedFile {
  url: string;
  filetype: string;
}

export interface DistributorMinimal {
  id: number;
  url: string;
  name: string;
}

export interface LocationMinimal {
  id: number;
  url: string;
  ranch: string;
  distributor: DistributorMinimal;
}

export interface FruitMinimal {
  id: number;
  url: string;
  name: string;
}

export interface HarvesterMinimal {
  id: number;
  url: string;
  harv_id: number;
  location: LocationMinimal;
  fruit: FruitMinimal;
  is_emulator: boolean;
}
