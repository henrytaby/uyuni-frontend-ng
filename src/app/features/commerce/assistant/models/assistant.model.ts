export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  matchedProducts?: MatchedProduct[];
  providerUsed?: string;
  modelUsed?: string;
  fallbackOccurred?: boolean;
}

export interface MatchedProduct {
  item_number: number;
  name: string;
  brand?: string | null;
  model?: string | null;
  available_stock: number;
  sold_stock: number;
  official_price: number;
  minimum_price: number;
  currency: string;
  features?: string | null;
  description?: string | null;
}

export interface ChatAssistantRequest {
  message: string;
  history?: { role: 'user' | 'assistant'; content: string }[];
  provider?: string | null;
  model?: string | null;
  include_stock_data?: boolean;
}

export interface ChatAssistantResponse {
  reply: string;
  provider_used: string;
  model_used: string;
  matched_products: MatchedProduct[];
  fallback_occurred: boolean;
}

export interface AssistantProvidersResponse {
  default_provider: string;
  configured_providers: string[];
  all_providers: string[];
}
