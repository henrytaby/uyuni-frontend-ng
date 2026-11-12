export interface UserProfileResponse {
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
  timezone?: string | null;
  is_verified: boolean;
  is_active: boolean;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface UserProfileUpdatePayload {
  first_name?: string | null;
  last_name?: string | null;
  phone?: string | null;
  avatar_url?: string | null;
  country?: string | null;
  city?: string | null;
  address?: string | null;
  timezone?: string | null;
}

export interface UserChangePasswordPayload {
  current_password: string;
  new_password: string;
}

export interface MediaUploadResponse {
  url: string;
  public_id: string;
  format: string;
  bytes: number;
  width: number;
  height: number;
}

