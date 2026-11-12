import { CatalogItem } from '@core/models/catalog.model';

export interface ProductMaster {
  id: string;
  item_number: number;
  code: string;
  name: string;
  description?: string | null;
  category_id?: string | null;
  live_basket_id?: string | null;
  brand?: string | null;
  model?: string | null;
  official_price: number;
  minimum_price: number;
  published_price: number;
  currency: string;
  cover_image_url?: string | null;
  marketplace_url?: string | null;
  external_info_url?: string | null;
  features?: string | null;
  marketing_details?: string | null;
  is_reviewed: boolean;
  is_fb_verified: boolean;
  has_video: boolean;
  is_published_marketplace: boolean;
  is_whatsapp_published: boolean;
  is_active: boolean;
  total_available_stock: number;
  total_sold_stock: number;
  total_merma_stock: number;
  created_at?: string | null;
  updated_at?: string | null;
  created_by_id?: string | null;
  updated_by_id?: string | null;
}

export interface ProductMasterParams {
  offset?: number;
  limit?: number;
  search?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  category_id?: string;
  live_basket_id?: string;
  is_active?: boolean;
}

export interface ProductMasterCreatePayload {
  item_number: number;
  code?: string | null;
  name: string;
  description?: string | null;
  category_id?: string | null;
  live_basket_id?: string | null;
  brand?: string | null;
  model?: string | null;
  official_price?: number;
  minimum_price?: number;
  published_price?: number;
  currency?: string;
  cover_image_url?: string | null;
  marketplace_url?: string | null;
  external_info_url?: string | null;
  features?: string | null;
  marketing_details?: string | null;
  is_reviewed?: boolean;
  is_fb_verified?: boolean;
  has_video?: boolean;
  is_published_marketplace?: boolean;
  is_whatsapp_published?: boolean;
  is_active?: boolean;
}

export interface ProductMasterUpdatePayload {
  item_number?: number;
  code?: string | null;
  name?: string;
  description?: string | null;
  category_id?: string | null;
  live_basket_id?: string | null;
  brand?: string | null;
  model?: string | null;
  official_price?: number;
  minimum_price?: number;
  published_price?: number;
  currency?: string;
  cover_image_url?: string | null;
  marketplace_url?: string | null;
  external_info_url?: string | null;
  features?: string | null;
  marketing_details?: string | null;
  is_reviewed?: boolean;
  is_fb_verified?: boolean;
  has_video?: boolean;
  is_published_marketplace?: boolean;
  is_whatsapp_published?: boolean;
  is_active?: boolean;
}

export interface CommerceCatalogs {
  categories: CatalogItem[];
  liveBaskets: CatalogItem[];
}

