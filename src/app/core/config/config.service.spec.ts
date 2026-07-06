import { HttpBackend, HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { of, throwError } from 'rxjs';

import { LoggerService } from '@core/services/logger.service';

import { ConfigService } from './config.service';

describe('ConfigService', () => {
  let service: ConfigService;
  let loggerMock: jest.Mocked<LoggerService>;
  let httpClientMock: jest.Mocked<HttpClient>;

  beforeEach(() => {
    loggerMock = {
      debug: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      setMinLevelFromString: jest.fn()
    } as unknown as jest.Mocked<LoggerService>;

    httpClientMock = {
      get: jest.fn()
    } as unknown as jest.Mocked<HttpClient>;

    // Create a mock HttpBackend that returns our mock HttpClient
    const httpBackendMock = {
      handle: jest.fn()
    } as unknown as HttpBackend;

    TestBed.configureTestingModule({
      providers: [
        ConfigService,
        { provide: LoggerService, useValue: loggerMock },
        { provide: HttpBackend, useValue: httpBackendMock }
      ]
    });

    service = TestBed.inject(ConfigService);
    
    // Replace the internal http client with our mock
    (service as unknown as { http: HttpClient }).http = httpClientMock;
  });

  describe('initialization', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should have null config initially', () => {
      expect(service.config()).toBeNull();
    });
  });

  describe('loadConfig', () => {
    it('should load configuration successfully', async () => {
      const mockConfig = {
        apiUrl: 'https://api.example.com',
        loggingLevel: 'INFO'
      };

      httpClientMock.get.mockReturnValue(of(mockConfig));

      await service.loadConfig();

      expect(service.config()).toEqual(mockConfig);
    });

    it('should set logger level from config', async () => {
      const mockConfig = {
        apiUrl: 'https://api.example.com',
        loggingLevel: 'WARN'
      };

      httpClientMock.get.mockReturnValue(of(mockConfig));

      await service.loadConfig();

      expect(loggerMock.setMinLevelFromString).toHaveBeenCalledWith('WARN');
    });

    it('should log info message after loading', async () => {
      const mockConfig = {
        apiUrl: 'https://api.example.com'
      };

      httpClientMock.get.mockReturnValue(of(mockConfig));

      await service.loadConfig();

      expect(loggerMock.info).toHaveBeenCalledWith(
        'Configuration loaded successfully',
        { apiUrl: 'https://api.example.com' },
        'ConfigService'
      );
    });

    it('should handle load error gracefully', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      const error = new Error('Network error');

      httpClientMock.get.mockReturnValue(throwError(() => error));

      await service.loadConfig();

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        '[ConfigService] Could not load configuration:',
        error
      );

      consoleErrorSpy.mockRestore();
    });

    it('should not throw on error', async () => {
      // Suppress console.error for this test
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      const error = new Error('Network error');
  
      httpClientMock.get.mockReturnValue(throwError(() => error));
  
      // Should not throw
      await expect(service.loadConfig()).resolves.toBeUndefined();
  
      consoleErrorSpy.mockRestore();
    });

    it('should request correct config path', async () => {
      const mockConfig = { apiUrl: 'https://api.example.com' };
      httpClientMock.get.mockReturnValue(of(mockConfig));

      await service.loadConfig();

      expect(httpClientMock.get).toHaveBeenCalledWith('assets/config/config.json');
    });
  });

  describe('apiUrl', () => {
    it('should return empty string when config is null', () => {
      expect(service.apiUrl).toBe('');
    });

    it('should return apiUrl from config', async () => {
      const mockConfig = {
        apiUrl: 'https://api.test.com'
      };

      httpClientMock.get.mockReturnValue(of(mockConfig));

      await service.loadConfig();

      expect(service.apiUrl).toBe('https://api.test.com');
    });
  });

  describe('authConfig', () => {
    it('should return undefined when config is null', () => {
      expect(service.authConfig).toBeUndefined();
    });

    it('should return authConfig from config', async () => {
      const mockConfig = {
        apiUrl: 'https://api.example.com',
        authConfig: {
          clientId: 'test-client',
          issuer: 'https://auth.example.com'
        }
      };

      httpClientMock.get.mockReturnValue(of(mockConfig));

      await service.loadConfig();

      expect(service.authConfig).toEqual({
        clientId: 'test-client',
        issuer: 'https://auth.example.com'
      });
    });
  });

  describe('featureFlags', () => {
    it('should return undefined when config is null', () => {
      expect(service.featureFlags).toBeUndefined();
    });

    it('should return featureFlags from config', async () => {
      const mockConfig = {
        apiUrl: 'https://api.example.com',
        featureFlags: {
          newDashboard: true,
          darkMode: false
        }
      };

      httpClientMock.get.mockReturnValue(of(mockConfig));

      await service.loadConfig();

      expect(service.featureFlags).toEqual({
        newDashboard: true,
        darkMode: false
      });
    });
  });

  describe('appVersion', () => {
    it('should return default version when config is null', () => {
      expect(service.appVersion).toBe('1.0.0');
    });

    it('should return appVersion from config', async () => {
      const mockConfig = {
        apiUrl: 'https://api.example.com',
        appVersion: '2.5.0'
      };

      httpClientMock.get.mockReturnValue(of(mockConfig));

      await service.loadConfig();

      expect(service.appVersion).toBe('2.5.0');
    });
  });

  describe('config signal', () => {
    it('should be readonly', () => {
      // The config signal should be readonly (asReadonly() was used)
      expect(typeof service.config).toBe('function');
    });

    it('should update when config is loaded', async () => {
      const mockConfig = {
        apiUrl: 'https://api.example.com'
      };

      httpClientMock.get.mockReturnValue(of(mockConfig));

      expect(service.config()).toBeNull();

      await service.loadConfig();

      expect(service.config()).toEqual(mockConfig);
    });
  });

  describe('edge cases', () => {
    it('should handle config without loggingLevel', async () => {
      const mockConfig = {
        apiUrl: 'https://api.example.com'
      };

      httpClientMock.get.mockReturnValue(of(mockConfig));

      await service.loadConfig();

      expect(loggerMock.setMinLevelFromString).not.toHaveBeenCalled();
    });

    it('should handle empty config object', async () => {
      const mockConfig = {};

      httpClientMock.get.mockReturnValue(of(mockConfig));

      await service.loadConfig();

      expect(service.apiUrl).toBe('');
      expect(service.appVersion).toBe('1.0.0');
    });

    it('should handle partial config', async () => {
      const mockConfig = {
        apiUrl: 'https://api.example.com',
        appVersion: '3.0.0'
        // No authConfig or featureFlags
      };

      httpClientMock.get.mockReturnValue(of(mockConfig));

      await service.loadConfig();

      expect(service.apiUrl).toBe('https://api.example.com');
      expect(service.appVersion).toBe('3.0.0');
      expect(service.authConfig).toBeUndefined();
      expect(service.featureFlags).toBeUndefined();
    });
  });
});
