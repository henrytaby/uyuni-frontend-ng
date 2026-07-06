import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { AuthErrorCode,AuthErrorHandlerService } from './auth-error-handler.service';
import { LoggerService } from './logger.service';

describe('AuthErrorHandlerService', () => {
  let service: AuthErrorHandlerService;
  let loggerMock: jest.Mocked<LoggerService>;

  beforeEach(() => {
    loggerMock = {
      debug: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn()
    } as unknown as jest.Mocked<LoggerService>;

    TestBed.configureTestingModule({
      providers: [
        AuthErrorHandlerService,
        { provide: LoggerService, useValue: loggerMock }
      ]
    });

    service = TestBed.inject(AuthErrorHandlerService);
  });

  describe('initialization', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });
  });

  describe('AuthErrorCode enum', () => {
    it('should have all expected error codes', () => {
      expect(AuthErrorCode.INVALID_CREDENTIALS).toBe('INVALID_CREDENTIALS');
      expect(AuthErrorCode.ACCOUNT_LOCKED).toBe('ACCOUNT_LOCKED');
      expect(AuthErrorCode.SESSION_EXPIRED).toBe('SESSION_EXPIRED');
      expect(AuthErrorCode.NETWORK_ERROR).toBe('NETWORK_ERROR');
      expect(AuthErrorCode.SERVER_ERROR).toBe('SERVER_ERROR');
      expect(AuthErrorCode.UNKNOWN_ERROR).toBe('UNKNOWN_ERROR');
    });
  });

  describe('handleLoginError', () => {
    it('should handle 401 error as invalid credentials', () => {
      const error = new HttpErrorResponse({ status: 401 });
      
      const result = service.handleLoginError(error);
      
      expect(result.code).toBe(AuthErrorCode.INVALID_CREDENTIALS);
      expect(result.message).toBe('Usuario o contraseña incorrectos.');
      expect(result.originalError).toBe(error);
    });

    it('should handle 403 error with ACCOUNT_LOCKED code', () => {
      const error = new HttpErrorResponse({
        status: 403,
        error: {
          detail: {
            code: 'ACCOUNT_LOCKED',
            wait_seconds: 300,
            max_attempts: 5,
            lockout_minutes: 15
          }
        }
      });
      
      const result = service.handleLoginError(error);
      
      expect(result.code).toBe(AuthErrorCode.ACCOUNT_LOCKED);
      expect(result.message).toContain('5 intentos fallidos');
      expect(result.message).toContain('5 minutos');
      expect(result.details?.waitSeconds).toBe(300);
      expect(result.details?.maxAttempts).toBe(5);
      expect(result.details?.lockoutMinutes).toBe(15);
    });

    it('should handle 403 error without specific code', () => {
      const error = new HttpErrorResponse({
        status: 403,
        error: {}
      });
      
      const result = service.handleLoginError(error);
      
      expect(result.code).toBe(AuthErrorCode.ACCOUNT_LOCKED);
      expect(result.message).toBe('Cuenta bloqueada. Por favor, inténtelo más tarde.');
    });
  
    it('should handle lockout error that throws during parsing', () => {
      // Create a throwing error object that will cause the try-catch to fail
      const throwingErrorDetail = {
        get detail() {
          throw new Error('Getter error');
        }
      };
      
      // Create a real HttpErrorResponse with the throwing error
      const throwingError = new HttpErrorResponse({
        status: 403,
        error: throwingErrorDetail
      });
  
      const result = service.handleLoginError(throwingError);
  
      expect(result.code).toBe(AuthErrorCode.ACCOUNT_LOCKED);
      expect(result.message).toBe('Cuenta bloqueada. Por favor, inténtelo más tarde.');
      expect(loggerMock.error).toHaveBeenCalledWith(
        'Failed to parse lockout error',
        throwingError,
        'AuthErrorHandler'
      );
    });
  
    it('should handle network error (status 0)', () => {
      const error = new HttpErrorResponse({ status: 0 });
      
      const result = service.handleLoginError(error);
      
      expect(result.code).toBe(AuthErrorCode.NETWORK_ERROR);
      expect(result.message).toBe('No se pudo conectar con el servidor. Por favor, verifique su conexión.');
    });

    it('should handle server error (500)', () => {
      const error = new HttpErrorResponse({ status: 500 });
      
      const result = service.handleLoginError(error);
      
      expect(result.code).toBe(AuthErrorCode.SERVER_ERROR);
      expect(result.message).toBe('Error del servidor. Por favor, inténtelo más tarde.');
    });

    it('should handle server error (502)', () => {
      const error = new HttpErrorResponse({ status: 502 });
      
      const result = service.handleLoginError(error);
      
      expect(result.code).toBe(AuthErrorCode.SERVER_ERROR);
    });

    it('should handle server error (503)', () => {
      const error = new HttpErrorResponse({ status: 503 });
      
      const result = service.handleLoginError(error);
      
      expect(result.code).toBe(AuthErrorCode.SERVER_ERROR);
    });

    it('should handle unknown HTTP status (418)', () => {
      const error = new HttpErrorResponse({ status: 418 }); // I'm a teapot
      
      const result = service.handleLoginError(error);
      
      expect(result.code).toBe(AuthErrorCode.UNKNOWN_ERROR);
      expect(result.message).toBe('Ha ocurrido un error inesperado. Por favor, inténtelo de nuevo.');
    });

    it('should handle non-HTTP errors', () => {
      const error = new Error('Random error');
      
      const result = service.handleLoginError(error);
      
      expect(result.code).toBe(AuthErrorCode.UNKNOWN_ERROR);
      expect(loggerMock.error).toHaveBeenCalledWith('Unknown error type', error, 'AuthErrorHandler');
    });

    it('should log warning for login errors', () => {
      const error = new HttpErrorResponse({ status: 401 });
      
      service.handleLoginError(error);
      
      expect(loggerMock.warn).toHaveBeenCalledWith(
        'Login error occurred',
        { code: AuthErrorCode.INVALID_CREDENTIALS, status: 401 },
        'AuthErrorHandler'
      );
    });
  });

  describe('handleRefreshError', () => {
    it('should return SESSION_EXPIRED for HTTP errors', () => {
      const error = new HttpErrorResponse({ status: 401 });
      
      const result = service.handleRefreshError(error);
      
      expect(result.code).toBe(AuthErrorCode.SESSION_EXPIRED);
      expect(result.message).toBe('Su sesión ha expirado. Por favor, inicie sesión nuevamente.');
    });

    it('should return UNKNOWN_ERROR for non-HTTP errors', () => {
      const error = new Error('Network failure');
      
      const result = service.handleRefreshError(error);
      
      expect(result.code).toBe(AuthErrorCode.UNKNOWN_ERROR);
    });

    it('should log warning for refresh errors', () => {
      const error = new HttpErrorResponse({ status: 401 });
      
      service.handleRefreshError(error);
      
      expect(loggerMock.warn).toHaveBeenCalledWith(
        'Token refresh error',
        { status: 401 },
        'AuthErrorHandler'
      );
    });
  });

  describe('handleLockedAccount', () => {
    it('should parse lockout details correctly', () => {
      const error = new HttpErrorResponse({
        status: 403,
        error: {
          detail: {
            code: 'ACCOUNT_LOCKED',
            wait_seconds: 600,
            max_attempts: 3,
            lockout_minutes: 30
          }
        }
      });
      
      const result = service.handleLoginError(error);
      
      expect(result.code).toBe(AuthErrorCode.ACCOUNT_LOCKED);
      expect(result.details?.waitSeconds).toBe(600);
      expect(result.details?.maxAttempts).toBe(3);
      expect(result.details?.lockoutMinutes).toBe(30);
      // Minutes should be ceil(600/60) = 10
      expect(result.message).toContain('10 minutos');
    });

    it('should handle malformed lockout error', () => {
      const error = new HttpErrorResponse({
        status: 403,
        error: 'Invalid JSON'
      });
      
      const result = service.handleLoginError(error);
      
      expect(result.code).toBe(AuthErrorCode.ACCOUNT_LOCKED);
      expect(result.message).toBe('Cuenta bloqueada. Por favor, inténtelo más tarde.');
    });

    it('should handle missing detail object', () => {
      const error = new HttpErrorResponse({
        status: 403,
        error: { some: 'other structure' }
      });
      
      const result = service.handleLoginError(error);
      
      expect(result.code).toBe(AuthErrorCode.ACCOUNT_LOCKED);
      expect(result.details).toBeUndefined();
    });
  });

  describe('getMessage', () => {
    it('should return message for INVALID_CREDENTIALS', () => {
      const message = service.getMessage(AuthErrorCode.INVALID_CREDENTIALS);
      expect(message).toBe('Usuario o contraseña incorrectos.');
    });

    it('should return message for ACCOUNT_LOCKED', () => {
      const message = service.getMessage(AuthErrorCode.ACCOUNT_LOCKED);
      expect(message).toBe('Cuenta bloqueada. Por favor, inténtelo más tarde.');
    });

    it('should return message for SESSION_EXPIRED', () => {
      const message = service.getMessage(AuthErrorCode.SESSION_EXPIRED);
      expect(message).toBe('Su sesión ha expirado. Por favor, inicie sesión nuevamente.');
    });

    it('should return message for NETWORK_ERROR', () => {
      const message = service.getMessage(AuthErrorCode.NETWORK_ERROR);
      expect(message).toBe('No se pudo conectar con el servidor. Por favor, verifique su conexión.');
    });

    it('should return message for SERVER_ERROR', () => {
      const message = service.getMessage(AuthErrorCode.SERVER_ERROR);
      expect(message).toBe('Error del servidor. Por favor, inténtelo más tarde.');
    });

    it('should return message for UNKNOWN_ERROR', () => {
      const message = service.getMessage(AuthErrorCode.UNKNOWN_ERROR);
      expect(message).toBe('Ha ocurrido un error inesperado. Por favor, inténtelo de nuevo.');
    });

    it('should return UNKNOWN_ERROR message for invalid code', () => {
      const message = service.getMessage('INVALID_CODE' as AuthErrorCode);
      expect(message).toBe('Ha ocurrido un error inesperado. Por favor, inténtelo de nuevo.');
    });
  });

  describe('error messages (Spanish)', () => {
    it('should have all messages in Spanish', () => {
      const messages = {
        [AuthErrorCode.INVALID_CREDENTIALS]: service.getMessage(AuthErrorCode.INVALID_CREDENTIALS),
        [AuthErrorCode.ACCOUNT_LOCKED]: service.getMessage(AuthErrorCode.ACCOUNT_LOCKED),
        [AuthErrorCode.SESSION_EXPIRED]: service.getMessage(AuthErrorCode.SESSION_EXPIRED),
        [AuthErrorCode.NETWORK_ERROR]: service.getMessage(AuthErrorCode.NETWORK_ERROR),
        [AuthErrorCode.SERVER_ERROR]: service.getMessage(AuthErrorCode.SERVER_ERROR),
        [AuthErrorCode.UNKNOWN_ERROR]: service.getMessage(AuthErrorCode.UNKNOWN_ERROR)
      };

      // Verify all messages are non-empty strings
      Object.values(messages).forEach(msg => {
        expect(typeof msg).toBe('string');
        expect(msg.length).toBeGreaterThan(0);
      });
    });
  });

  describe('edge cases', () => {
    it('should handle null error', () => {
      const result = service.handleLoginError(null);
      expect(result.code).toBe(AuthErrorCode.UNKNOWN_ERROR);
    });

    it('should handle undefined error', () => {
      const result = service.handleLoginError(undefined);
      expect(result.code).toBe(AuthErrorCode.UNKNOWN_ERROR);
    });

    it('should handle 401 with error body', () => {
      const error = new HttpErrorResponse({
        status: 401,
        error: { message: 'Invalid credentials' }
      });
      
      const result = service.handleLoginError(error);
      
      expect(result.code).toBe(AuthErrorCode.INVALID_CREDENTIALS);
      expect(result.originalError).toBe(error);
    });

    it('should calculate minutes correctly for partial minutes', () => {
      const error = new HttpErrorResponse({
        status: 403,
        error: {
          detail: {
            code: 'ACCOUNT_LOCKED',
            wait_seconds: 90, // 1.5 minutes -> should round up to 2
            max_attempts: 5,
            lockout_minutes: 15
          }
        }
      });
      
      const result = service.handleLoginError(error);
      
      expect(result.message).toContain('2 minutos');
    });

    it('should handle zero wait_seconds', () => {
      const error = new HttpErrorResponse({
        status: 403,
        error: {
          detail: {
            code: 'ACCOUNT_LOCKED',
            wait_seconds: 0,
            max_attempts: 5,
            lockout_minutes: 15
          }
        }
      });
      
      const result = service.handleLoginError(error);
      
      expect(result.details?.waitSeconds).toBe(0);
      expect(result.message).toContain('0 minutos');
    });
  });
});
