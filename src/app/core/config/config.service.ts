import { HttpBackend,HttpClient } from '@angular/common/http';
import { inject,Injectable, signal } from '@angular/core';

import { lastValueFrom } from 'rxjs';

import { LoggerService } from '@core/services/logger.service';

import { AppConfig } from './config.model';

/**
 * ConfigService handles application configuration loading.
 * 
 * Uses HttpBackend to bypass interceptors and avoid circular dependencies
 * during application initialization.
 * 
 * @example
 * ```typescript
 * // In app.config.ts
 * provideAppInitializer(() => {
 *   const configService = inject(ConfigService);
 *   return configService.loadConfig();
 * })
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private handler = inject(HttpBackend);
  private http = new HttpClient(this.handler);
  private logger = inject(LoggerService);

  private configSignal = signal<AppConfig | null>(null);
  
  readonly config = this.configSignal.asReadonly();

  /**
   * Load application configuration from assets
   * Called during APP_INITIALIZER
   */
  loadConfig(): Promise<void> {
    return lastValueFrom(this.http.get<AppConfig>('assets/config/config.json'))
      .then(config => {
        this.configSignal.set(config);
        
        // Configure logger with the loaded logging level
        if (config.loggingLevel) {
          this.logger.setMinLevelFromString(config.loggingLevel);
        }
        
        // Use direct console.log for this initial message since logger is now configured
        this.logger.info('Configuration loaded successfully', { apiUrl: config.apiUrl }, 'ConfigService');
      })
      .catch(error => {
        // Use console directly for config loading errors since logger might not be configured
        console.error('[ConfigService] Could not load configuration:', error);
      });
  }

  /**
   * Get the API URL from configuration
   */
  get apiUrl(): string {
    return this.configSignal()?.apiUrl || '';
  }

  /**
   * Get the auth configuration
   */
  get authConfig() {
    return this.configSignal()?.authConfig;
  }

  /**
   * Get feature flags
   */
  get featureFlags() {
    return this.configSignal()?.featureFlags;
  }

  /**
   * Get application version
   */
  get appVersion(): string {
    return this.configSignal()?.appVersion || '1.0.0';
  }
}
