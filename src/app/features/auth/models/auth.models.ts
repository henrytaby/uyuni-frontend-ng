export interface TokenResponse {
  access_token: string;
  token_type: string;
  refresh_token: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  is_verified: boolean;
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
