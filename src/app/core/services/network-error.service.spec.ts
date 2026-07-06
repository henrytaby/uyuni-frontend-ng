import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { of, throwError } from 'rxjs';

import { LoggerService } from './logger.service';
import { NetworkErrorService } from './network-error.service';

describe('NetworkErrorService', () => {
  let service: NetworkErrorService;
  let loggerMock: jest.Mocked<LoggerService>;
  let httpMock: jest.Mocked<HttpClient>;

  beforeEach(() => {
    loggerMock = {
      debug: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn()
    } as unknown as jest.Mocked<LoggerService>;

    httpMock = {
      head: jest.fn()
    } as unknown as jest.Mocked<HttpClient>;

    TestBed.configureTestingModule({
      providers: [
        NetworkErrorService,
        { provide: LoggerService, useValue: loggerMock },
        { provide: HttpClient, useValue: httpMock }
      ]
    });

    service = TestBed.inject(NetworkErrorService);
  });

  describe('initialization', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should have initial showConnectionError as false', () => {
      expect(service.showConnectionError()).toBe(false);
    });
  });

  describe('triggerConnectionError', () => {
    it('should set showConnectionError to true', () => {
      service.triggerConnectionError();
      expect(service.showConnectionError()).toBe(true);
    });

    it('should log warning', () => {
      service.triggerConnectionError();
      expect(loggerMock.warn).toHaveBeenCalledWith(
        'Connection error triggered',
        undefined,
        'NetworkErrorService'
      );
    });
  });

  describe('resetError', () => {
    it('should set showConnectionError to false', () => {
      service.triggerConnectionError();
      expect(service.showConnectionError()).toBe(true);
      
      service.resetError();
      expect(service.showConnectionError()).toBe(false);
    });

    it('should log debug message', () => {
      service.resetError();
      expect(loggerMock.debug).toHaveBeenCalledWith(
        'Connection error reset',
        undefined,
        'NetworkErrorService'
      );
    });
  });

  describe('checkConnection', () => {
    it('should return true when connection is successful', (done) => {
      httpMock.head.mockReturnValue(of(null));

      service.checkConnection().subscribe((result) => {
        expect(result).toBe(true);
        expect(loggerMock.debug).toHaveBeenCalledWith(
          'Connection check successful',
          undefined,
          'NetworkErrorService'
        );
        done();
      });
    });

    it('should return false when connection fails', (done) => {
      const error = new HttpErrorResponse({ status: 0 });
      httpMock.head.mockReturnValue(throwError(() => error));

      service.checkConnection().subscribe((result) => {
        expect(result).toBe(false);
        expect(loggerMock.warn).toHaveBeenCalledWith(
          'Connection check failed',
          error,
          'NetworkErrorService'
        );
        done();
      });
    });

    it('should call HEAD on favicon.ico', () => {
      httpMock.head.mockReturnValue(of(null));

      service.checkConnection().subscribe();

      expect(httpMock.head).toHaveBeenCalledWith('/favicon.ico', { responseType: 'blob' });
    });

    it('should log debug when starting connection check', () => {
      httpMock.head.mockReturnValue(of(null));

      service.checkConnection().subscribe();

      expect(loggerMock.debug).toHaveBeenCalledWith(
        'Checking connection...',
        undefined,
        'NetworkErrorService'
      );
    });
  });

  describe('signal reactivity', () => {
    it('should reflect value changes through signal', () => {
      // Initial state
      expect(service.showConnectionError()).toBe(false);

      service.triggerConnectionError();
      expect(service.showConnectionError()).toBe(true);

      service.resetError();
      expect(service.showConnectionError()).toBe(false);

      service.triggerConnectionError();
      expect(service.showConnectionError()).toBe(true);
    });

    it('should handle multiple trigger calls', () => {
      service.triggerConnectionError();
      service.triggerConnectionError();
      service.triggerConnectionError();

      expect(service.showConnectionError()).toBe(true);
    });
  });

  describe('edge cases', () => {
    it('should handle reset without trigger', () => {
      service.resetError();
      expect(service.showConnectionError()).toBe(false);
    });

    it('should handle multiple reset calls', () => {
      service.triggerConnectionError();
      service.resetError();
      service.resetError();
      service.resetError();

      expect(service.showConnectionError()).toBe(false);
    });

    it('should handle connection check with 500 error', (done) => {
      const error = new HttpErrorResponse({ status: 500 });
      httpMock.head.mockReturnValue(throwError(() => error));

      service.checkConnection().subscribe((result) => {
        expect(result).toBe(false);
        done();
      });
    });

    it('should handle connection check with timeout error', (done) => {
      const error = new ErrorEvent('timeout');
      httpMock.head.mockReturnValue(throwError(() => error));

      service.checkConnection().subscribe((result) => {
        expect(result).toBe(false);
        done();
      });
    });
  });
});
