import { CatalogItem } from '@core/models/catalog.model';

export interface SaleItem {
  id: string;
  sale_id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  unit_cost: number;
  total_price: number;
  net_margin: number;
}

export interface SaleItemCreatePayload {
  product_id: string;
  quantity: number;
  unit_price: number;
}

export interface Sale {
  id: string;
  sale_number: string;
  sheet_sale_id?: number | null;
  sale_date: string;
  customer_name: string;
  customer_phone?: string | null;
  channel_id?: string | null;
  channel: string;
  payment_method: string;
  payment_status: string;
  delivery_modality: string;
  delivery_address?: string | null;
  delivery_cost: number;
  delivery_cost_paid_by: string;
  delivery_status: string;
  total_collected: number;
  total_cost: number;
  net_profit: number;
  currency: string;
  observations?: string | null;
  items?: SaleItem[];
  created_at?: string | null;
  updated_at?: string | null;
  created_by_id?: string | null;
  updated_by_id?: string | null;
}

export interface SaleParams {
  offset?: number;
  limit?: number;
  search?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  channel?: string;
  payment_status?: string;
  delivery_status?: string;
}

export interface SaleCreatePayload {
  sale_number?: string | null;
  sheet_sale_id?: number | null;
  sale_date?: string | null;
  customer_name: string;
  customer_phone?: string | null;
  channel_id?: string | null;
  channel: string;
  payment_method: string;
  payment_status: string;
  delivery_modality: string;
  delivery_address?: string | null;
  delivery_cost?: number;
  delivery_cost_paid_by?: string;
  delivery_status?: string;
  total_collected?: number | null;
  currency?: string;
  observations?: string | null;
  allow_below_minimum?: boolean;
  items: SaleItemCreatePayload[];
}

export interface SaleUpdatePayload {
  customer_name?: string;
  customer_phone?: string | null;
  channel_id?: string | null;
  channel?: string;
  payment_method?: string;
  payment_status?: string;
  delivery_modality?: string;
  delivery_address?: string | null;
  delivery_cost?: number;
  delivery_cost_paid_by?: string;
  delivery_status?: string;
  currency?: string;
  observations?: string | null;
}

export interface SaleCatalogs {
  salesChannels: CatalogItem[];
  paymentStatuses: CatalogItem[];
  paymentMethods: CatalogItem[];
  deliveryModalities: CatalogItem[];
  deliveryPaidBy: CatalogItem[];
  deliveryStatuses: CatalogItem[];
}
