export interface TokenResponse {
  access_token: string;
  token_type: string;
  refresh_token: string;
}

export interface User {
  id: number | string;
  username: string;
  email: string;
  first_name?: string | null;
  last_name?: string | null;
  avatar_url?: string | null;
  phone?: string | null;
  country?: string | null;
  city?: string | null;
  address?: string | null;
  timezone?: string | null;
  is_verified: boolean;
  is_active?: boolean;
}

export interface UserRole {
  id: number;
  name: string;
  slug: string;
  description: string;
}

export interface LockoutError {
  detail: {
    message: string;
    code: 'ACCOUNT_LOCKED';
    unlock_at: string;
    wait_seconds: number;
    max_attempts: number;
    lockout_minutes: number;
  }
}
