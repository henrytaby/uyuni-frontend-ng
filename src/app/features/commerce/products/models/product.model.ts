import { CatalogItem } from '@core/models/catalog.model';

export interface Product {
  id: string;
  master_product_id: string;
  batch_id?: string | null;
  sheet_row_id?: number | null;
  variant_name?: string | null;
  cost_price?: number | null;
  initial_quantity: number;
  sold_quantity: number;
  merma_quantity: number;
  available_quantity: number;
  status: string;
  physical_condition: string;
  defect_detail?: string | null;
  is_reviewed: boolean;
  name: string;
  official_price: number;
  minimum_price: number;
  published_price: number;
  batch_name?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  created_by_id?: string | null;
  updated_by_id?: string | null;
}

export interface ProductParams {
  offset?: number;
  limit?: number;
  search?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  batch_id?: string;
  master_product_id?: string;
  status?: string;
}

export interface ProductCreatePayload {
  master_product_id: string;
  batch_id?: string | null;
  sheet_row_id?: number | null;
  variant_name?: string | null;
  cost_price?: number | null;
  initial_quantity?: number;
  sold_quantity?: number;
  merma_quantity?: number;
  available_quantity?: number;
  status?: string;
  physical_condition?: string;
  defect_detail?: string | null;
  is_reviewed?: boolean;
}

export interface ProductUpdatePayload {
  master_product_id?: string;
  batch_id?: string | null;
  sheet_row_id?: number | null;
  variant_name?: string | null;
  cost_price?: number | null;
  initial_quantity?: number;
  sold_quantity?: number;
  merma_quantity?: number;
  available_quantity?: number;
  status?: string;
  physical_condition?: string;
  defect_detail?: string | null;
  is_reviewed?: boolean;
}

export interface ProductCatalogs {
  masterProducts: CatalogItem[];
  batches: CatalogItem[];
  statuses: CatalogItem[];
  physicalConditions: CatalogItem[];
}

