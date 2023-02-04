export interface BaseDocument {
  id?: string;
  created_at?: string;
  updated_at?: string;
  last_synced?: string;
}

export interface Document extends BaseDocument {
  [key: string]: unknown;
}
