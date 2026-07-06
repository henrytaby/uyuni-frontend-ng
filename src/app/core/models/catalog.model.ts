export interface CatalogItem {
  value: string | number;
  label: string;
  extra?: unknown | null;
}

export type CatalogBulkRequest = Record<string, Record<string, unknown>>;

export type CatalogBulkResponse = Record<string, CatalogItem[]>;
