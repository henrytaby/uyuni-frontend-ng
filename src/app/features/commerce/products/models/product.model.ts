import { CatalogItem } from '@core/models/catalog.model';

export interface Product {
  id: string;
  name: string;
  variant_name?: string | null;
  item_number?: number | null;
  master_code?: string | null;
  image_url?: string | null;
  category_name?: string | null;

  batch_id?: string | null;
  batch_code?: string | null;
  batch_name?: string | null;
  currency?: string;

  // Estrategia de 4 Precios
  official_price: number;
  published_price: number;
  minimum_price: number;
  cost_price?: number | null;

  // Métricas de Margen Calculadas
  estimated_margin?: number | null;
  discount_margin?: number | null;

  // Existencias
  initial_quantity: number;
  sold_quantity: number;
  merma_quantity: number;
  available_quantity: number;

  // Estados
  status: 'AVAILABLE' | 'SOLD_OUT' | 'SCRAPPED' | string;
  physical_condition: 'OPERATIONAL' | 'DAMAGED_SCRAP' | 'FOR_PARTS' | 'INCOMPLETE' | string;
  defect_detail?: string | null;
  is_reviewed: boolean;
  master_product_id: string;

  sheet_row_id?: number | null;
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
  published_price?: number;
  minimum_price?: number;
  official_price?: number;
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
  published_price?: number;
  minimum_price?: number;
  official_price?: number;
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

export interface ProductRealImage {
  id: string;
  product_master_id: string;
  product_id: string;
  url: string;
  public_id: string;
  image_type: 'REAL' | string;
  title: string | null;
  original_filename: string | null;
  file_size_bytes: number | null;
  width: number | null;
  height: number | null;
  format: string | null;
  is_public: boolean;
  sort_order: number;
  created_at: string;
}

export interface ImageReorderItem {
  id: string;
  sort_order: number;
}
