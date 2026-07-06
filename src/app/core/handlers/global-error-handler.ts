import { ErrorHandler, inject,Injectable, Injector } from '@angular/core';

import { LoggerService } from '@core/services/logger.service';
import { NetworkErrorService } from '@core/services/network-error.service';

/**
 * Global Error Handler
 * 
 * Catches unhandled errors and network-related chunk loading failures.
 * Uses LoggerService for consistent logging.
 * 
 * @example
 * // Registered in app.config.ts
 * { provide: ErrorHandler, useClass: GlobalErrorHandler }
 */
@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  private injector = inject(Injector);
  private logger?: LoggerService;

  /**
   * Handle application-wide errors
   */
  handleError(error: unknown): void {
    const chunkFailedMessage = /Loading chunk [\d]+ failed/;
    const dynamicImportMessage = /error loading dynamically imported module/;
    const errorMessage = error instanceof Error ? error.message : String(error);

    if (chunkFailedMessage.test(errorMessage) || dynamicImportMessage.test(errorMessage)) {
      this.handleChunkLoadError(errorMessage);
    } else {
      this.logError(error);
    }
  }

  /**
   * Handle chunk loading failures (network issues)
   */
  private handleChunkLoadError(errorMessage: string): void {
    this.getLogger().error('Network chunk error detected', errorMessage, 'GlobalErrorHandler');
    
    const networkService = this.injector.get(NetworkErrorService);
    networkService.triggerConnectionError();
  }

  /**
   * Log general errors
   */
  private logError(error: unknown): void {
    this.getLogger().error('Unhandled error', error, 'GlobalErrorHandler');
  }

  /**
   * Get LoggerService lazily to avoid circular dependency
   */
  private getLogger(): LoggerService {
    if (!this.logger) {
      this.logger = this.injector.get(LoggerService);
    }
    return this.logger;
  }
}
