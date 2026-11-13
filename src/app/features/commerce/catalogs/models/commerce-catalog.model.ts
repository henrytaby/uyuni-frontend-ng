export interface CatalogQueryParams {
  offset?: number;
  limit?: number;
  search?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

// 1. Categorías de Producto
export interface CommerceCategory {
  id: string;
  code: string;
  name: string;
  icon?: string | null;
  description?: string | null;
  typical_products?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface CategoryCreatePayload {
  code: string;
  name: string;
  icon?: string | null;
  description?: string | null;
  typical_products?: string | null;
}

export interface CategoryUpdatePayload {
  code?: string;
  name?: string;
  icon?: string | null;
  description?: string | null;
  typical_products?: string | null;
}

// 2. Canales de Venta
export interface CommerceChannel {
  id: string;
  code: string;
  name: string;
  description?: string | null;
  is_active: boolean;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface ChannelCreatePayload {
  code: string;
  name: string;
  description?: string | null;
  is_active?: boolean;
}

export interface ChannelUpdatePayload {
  code?: string;
  name?: string;
  description?: string | null;
  is_active?: boolean;
}

// 3. Canastas de Subasta Live
export interface CommerceLiveBasket {
  id: string;
  code: string;
  name: string;
  label: string;
  description?: string | null;
  price_range?: string | null;
  target_audience?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface LiveBasketCreatePayload {
  code: string;
  name: string;
  label: string;
  description?: string | null;
  price_range?: string | null;
  target_audience?: string | null;
}

export interface LiveBasketUpdatePayload {
  code?: string;
  name?: string;
  label?: string;
  description?: string | null;
  price_range?: string | null;
  target_audience?: string | null;
}

// 4. Rondas de Inversión
export interface CommerceRound {
  id: string;
  code: string;
  name: string;
  disbursement_date?: string | null;
  capital_invested: number;
  currency: string;
  status: string;
  observations?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface RoundCreatePayload {
  code: string;
  name: string;
  disbursement_date?: string | null;
  capital_invested?: number;
  currency?: string;
  status?: string;
  observations?: string | null;
}

export interface RoundUpdatePayload {
  code?: string;
  name?: string;
  disbursement_date?: string | null;
  capital_invested?: number;
  currency?: string;
  status?: string;
  observations?: string | null;
}

