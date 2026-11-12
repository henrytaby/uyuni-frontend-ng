export interface RoleSummary {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  icon?: string | null;
}

export interface User {
  id: string;
  username: string;
  email: string;
  first_name?: string | null;
  last_name?: string | null;
  phone?: string | null;
  avatar_url?: string | null;
  country?: string | null;
  city?: string | null;
  address?: string | null;
  notes?: string | null;
  timezone?: string | null;
  is_verified: boolean;
  is_active: boolean;
  is_superuser: boolean;
  role_slugs?: string[];
  roles?: RoleSummary[];
  created_at?: string | null;
  updated_at?: string | null;
  created_by_id?: string | null;
  updated_by_id?: string | null;
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

export interface UserCreatePayload {
  username: string;
  email: string;
  password: string;
  first_name?: string | null;
  last_name?: string | null;
  phone?: string | null;
  avatar_url?: string | null;
  country?: string | null;
  city?: string | null;
  address?: string | null;
  notes?: string | null;
  timezone?: string | null;
  is_active?: boolean;
  is_superuser?: boolean;
  is_verified?: boolean;
  role_slugs?: string[];
}

export interface UserUpdatePayload {
  username?: string;
  email?: string;
  password?: string;
  first_name?: string | null;
  last_name?: string | null;
  phone?: string | null;
  avatar_url?: string | null;
  country?: string | null;
  city?: string | null;
  address?: string | null;
  notes?: string | null;
  timezone?: string | null;
  is_active?: boolean;
  is_superuser?: boolean;
  is_verified?: boolean;
  role_slugs?: string[];
}

export interface UserLoginLog {
  id: string;
  created_at: string;
  ip_address: string;
  host_info: string;
  is_successful: boolean;
  logged_out_at?: string | null;
}

export interface RoleCatalogItem {
  value: string;
  label: string;
  extra?: {
    icon?: string;
    description?: string;
  } | null;
}
