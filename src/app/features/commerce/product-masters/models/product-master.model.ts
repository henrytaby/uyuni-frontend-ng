import { CatalogItem } from '@core/models/catalog.model';

export interface ProductMaster {
  id: string;
  item_number: number;
  code?: string | null;
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
  images?: ProductImage[];
  images_count?: number;
  external_links?: ProductMasterExternalLink[];
  external_links_count?: number;
  reference_links?: ProductMasterExternalLink[];
  reference_links_count?: number;
  marketplace_links?: ProductMasterExternalLink[];
  marketplace_links_count?: number;
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
  item_number?: number | null;
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
  // Nota: item_number es inmutable en el backend una vez creado
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

export interface ProductImage {
  id: string;
  product_master_id: string;
  product_id?: string | null;
  url: string;
  public_id: string;
  image_type: 'CATALOG' | 'REAL' | 'MARKETING' | 'BANNER' | string;
  title?: string | null;
  original_filename?: string | null;
  file_size_bytes?: number | null;
  width?: number | null;
  height?: number | null;
  format?: string | null;
  is_cover: boolean;
  sort_order: number;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface ProductImageReorderItem {
  id: string;
  sort_order: number;
}

export type ProductLinkPortal =
  | 'FACEBOOK'
  | 'AMAZON'
  | 'EBAY'
  | 'ALIBABA'
  | 'ALIEXPRESS'
  | 'WALMART'
  | 'MERCADOLIBRE'
  | 'YOUTUBE'
  | 'TIKTOK'
  | 'INSTAGRAM'
  | 'WHATSAPP'
  | 'SHEIN'
  | 'TEMU'
  | 'OTHER'
  | string;

export type ProductLinkType = 'REFERENCE' | 'MARKETPLACE' | string;

export interface ProductMasterExternalLink {
  id: string;
  product_master_id: string;
  url: string;
  portal: ProductLinkPortal;
  link_type: ProductLinkType;
  label?: string | null;
  is_primary: boolean;
  is_public: boolean;
  sort_order: number;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface ProductMasterExternalLinkCreate {
  url: string;
  link_type?: ProductLinkType;
  label?: string | null;
  is_primary?: boolean;
  is_public?: boolean;
}

export interface ProductMasterExternalLinkUpdate {
  url?: string;
  link_type?: ProductLinkType;
  label?: string | null;
  is_primary?: boolean;
  is_public?: boolean;
  sort_order?: number;
}

export interface ProductMasterExternalLinkReorderItem {
  id: string;
  sort_order: number;
}



