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
