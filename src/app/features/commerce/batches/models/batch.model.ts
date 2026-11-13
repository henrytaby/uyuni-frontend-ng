import { CatalogItem } from '@core/models/catalog.model';

export interface Batch {
  id: string;
  code: string;
  name: string;
  investment_round_id?: string | null;
  provider?: string | null;
  batch_type?: string | null;
  purchase_date?: string | null;
  purchase_price: number;
  freight_cost: number;
  total_cost: number;
  currency: string;
  initial_items_count: number;
  merma_items_count: number;
  sellable_items_count: number;
  unit_cost: number;
  status: string;
  financial_status: string;
  observations?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  created_by_id?: string | null;
  updated_by_id?: string | null;
}

export interface BatchParams {
  offset?: number;
  limit?: number;
  search?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export interface BatchCreatePayload {
  code: string;
  name: string;
  investment_round_id?: string | null;
  provider?: string | null;
  batch_type?: string | null;
  purchase_date?: string | null;
  purchase_price?: number;
  freight_cost?: number;
  total_cost?: number;
  currency?: string;
  initial_items_count?: number;
  merma_items_count?: number;
  sellable_items_count?: number;
  unit_cost?: number;
  status?: string;
  financial_status?: string;
  observations?: string | null;
}

export interface BatchUpdatePayload {
  code?: string;
  name?: string;
  investment_round_id?: string | null;
  provider?: string | null;
  batch_type?: string | null;
  purchase_date?: string | null;
  purchase_price?: number;
  freight_cost?: number;
  total_cost?: number;
  currency?: string;
  initial_items_count?: number;
  merma_items_count?: number;
  sellable_items_count?: number;
  unit_cost?: number;
  status?: string;
  financial_status?: string;
  observations?: string | null;
}

export interface BatchCatalogs {
  investmentRounds: CatalogItem[];
  statuses: CatalogItem[];
  financialStatuses: CatalogItem[];
}

