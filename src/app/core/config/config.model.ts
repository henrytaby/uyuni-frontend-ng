export interface AuthConfig {
  loginUrl: string;
  tokenKey: string;
  refreshKey: string;
}

export interface FeatureFlags {
  enableSignup: boolean;
  maintenanceMode: boolean;
  mockAuth?: boolean;
}

export interface AppConfig {
  apiUrl: string;
  authConfig: AuthConfig;
  appVersion: string;
  loggingLevel: string;
  featureFlags: FeatureFlags;
}
