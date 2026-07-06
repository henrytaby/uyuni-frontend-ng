export interface User {
  id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_verified: boolean;
  is_active: boolean;
  is_superuser: boolean;
  created_at: string | null;
  updated_at: string | null;
  created_by_id: string | null;
  updated_by_id: string | null;
}

export interface UserParams {
  offset?: number;
  limit?: number;
  search?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  is_active?: boolean;
  is_verified?: boolean;
  is_superuser?: boolean;
}


