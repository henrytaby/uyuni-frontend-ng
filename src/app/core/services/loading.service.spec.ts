import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { NavigationCancel, NavigationEnd, NavigationError,NavigationStart, Router } from '@angular/router';

import { LoadingService } from './loading.service';
import { LoggerService } from './logger.service';

describe('LoadingService', () => {
  let service: LoadingService;
  let routerMock: jest.Mocked<Router>;
  let loggerMock: jest.Mocked<LoggerService>;
  let routerEventsCallback: (event: unknown) => void;
  let subscriptionUnsubscribe: jest.Mock;

  beforeEach(() => {
    // Create mocks
    loggerMock = {
      debug: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn()
    } as unknown as jest.Mocked<LoggerService>;

    subscriptionUnsubscribe = jest.fn();

    routerMock = {
      events: {
        subscribe: jest.fn((callback: (event: unknown) => void) => {
          routerEventsCallback = callback;
          return { unsubscribe: subscriptionUnsubscribe };
        })
      }
    } as unknown as jest.Mocked<Router>;

    TestBed.configureTestingModule({
      providers: [
        LoadingService,
        { provide: Router, useValue: routerMock },
        { provide: LoggerService, useValue: loggerMock }
      ]
    });

    service = TestBed.inject(LoadingService);
  });

  afterEach(() => {
    service.ngOnDestroy();
  });

  describe('initialization', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should subscribe to router events', () => {
      expect(routerMock.events.subscribe).toHaveBeenCalled();
    });

    it('should have initial loading state as false', () => {
      expect(service.isLoading()).toBe(false);
    });

    it('should have initial navigating state as false', () => {
      expect(service.isNavigating()).toBe(false);
    });
  });

  describe('showLoader', () => {
    it('should increment request count', () => {
      service.showLoader();
      expect(loggerMock.debug).toHaveBeenCalledWith(
        expect.stringContaining('showLoader: count=1'),
        undefined,
        'LoadingService'
      );
    });

    it('should not set isLoading immediately (debounce)', () => {
      service.showLoader();
      expect(service.isLoading()).toBe(false);
    });

    it('should set isLoading to true after debounce (300ms)', fakeAsync(() => {
      service.showLoader();
      tick(300);
      expect(service.isLoading()).toBe(true);
    }));

    it('should not set isLoading if request completes before debounce', fakeAsync(() => {
      service.showLoader();
      service.hideLoader(); // Complete before debounce
      tick(300);
      expect(service.isLoading()).toBe(false);
    }));

    it('should handle multiple concurrent requests', fakeAsync(() => {
      service.showLoader(); // count = 1
      service.showLoader(); // count = 2
      tick(300);
      expect(service.isLoading()).toBe(true);
      
      service.hideLoader(); // count = 1
      expect(service.isLoading()).toBe(true); // Still loading
      
      service.hideLoader(); // count = 0
      expect(service.isLoading()).toBe(false); // Now stopped
    }));
  });

  describe('hideLoader', () => {
    it('should decrement request count', fakeAsync(() => {
      service.showLoader();
      tick(300);
      service.hideLoader();
      expect(loggerMock.debug).toHaveBeenCalledWith(
        expect.stringContaining('hideLoader: count=0'),
        undefined,
        'LoadingService'
      );
    }));

    it('should not go below zero', () => {
      service.hideLoader(); // count would be -1, but clamped to 0
      expect(loggerMock.debug).toHaveBeenCalledWith(
        expect.stringContaining('hideLoader: count=0'),
        undefined,
        'LoadingService'
      );
    });

    it('should stop loading when count reaches zero', fakeAsync(() => {
      service.showLoader();
      tick(300);
      expect(service.isLoading()).toBe(true);
      
      service.hideLoader();
      expect(service.isLoading()).toBe(false);
    }));

    it('should keep loading if more requests pending', fakeAsync(() => {
      service.showLoader();
      service.showLoader();
      tick(300);
      
      service.hideLoader(); // count = 1
      expect(service.isLoading()).toBe(true);
    }));
  });

  describe('forceReset', () => {
    it('should reset request count to zero', fakeAsync(() => {
      service.showLoader();
      service.showLoader();
      service.showLoader();
      tick(300);
      
      service.forceReset();
      expect(service.isLoading()).toBe(false);
    }));

    it('should set isLoading to false', fakeAsync(() => {
      service.showLoader();
      tick(300);
      expect(service.isLoading()).toBe(true);
      
      service.forceReset();
      expect(service.isLoading()).toBe(false);
    }));

    it('should clear all timers', fakeAsync(() => {
      service.showLoader();
      // Don't tick, so debounce timer is still pending
      service.forceReset();
      
      tick(500); // Would have triggered debounce if not cleared
      expect(service.isLoading()).toBe(false);
    }));
  });

  describe('router events', () => {
    it('should set isNavigating to true on NavigationStart', () => {
      const event = new NavigationStart(1, '/test');
      routerEventsCallback(event);
      
      expect(service.isNavigating()).toBe(true);
    });

    it('should call forceReset on NavigationStart', () => {
      const event = new NavigationStart(1, '/test');
      routerEventsCallback(event);
      
      expect(loggerMock.debug).toHaveBeenCalledWith(
        'forceReset called',
        undefined,
        'LoadingService'
      );
    });

    it('should set isNavigating to false on NavigationEnd', () => {
      // First set navigating to true
      routerEventsCallback(new NavigationStart(1, '/test'));
      expect(service.isNavigating()).toBe(true);
      
      // Then end navigation
      const event = new NavigationEnd(1, '/test', '/test');
      routerEventsCallback(event);
      
      expect(service.isNavigating()).toBe(false);
    });

    it('should set isNavigating to false on NavigationCancel', () => {
      routerEventsCallback(new NavigationStart(1, '/test'));
      expect(service.isNavigating()).toBe(true);
      
      const event = new NavigationCancel(1, '/test', 'cancelled');
      routerEventsCallback(event);
      
      expect(service.isNavigating()).toBe(false);
    });

    it('should set isNavigating to false on NavigationError', () => {
      routerEventsCallback(new NavigationStart(1, '/test'));
      expect(service.isNavigating()).toBe(true);
      
      const event = new NavigationError(1, '/test', new Error('test'));
      routerEventsCallback(event);
      
      expect(service.isNavigating()).toBe(false);
    });
  });

  describe('fail-safe timer', () => {
    it('should trigger fail-safe after 6 seconds', fakeAsync(() => {
      service.showLoader();
      tick(300); // Trigger debounce
      expect(service.isLoading()).toBe(true);
      
      tick(6000); // Trigger fail-safe
      expect(service.isLoading()).toBe(false);
      expect(loggerMock.warn).toHaveBeenCalledWith(
        'Fail-safe triggered. Forcing reset.',
        undefined,
        'LoadingService'
      );
    }));

    it('should clear fail-safe timer when loading completes', fakeAsync(() => {
      service.showLoader();
      tick(300);
      
      service.hideLoader(); // Should clear fail-safe timer
      
      tick(6000); // Fail-safe would have triggered if not cleared
      expect(loggerMock.warn).not.toHaveBeenCalled();
    }));
  });

  describe('ngOnDestroy', () => {
    it('should unsubscribe from router events', () => {
      service.ngOnDestroy();
      expect(subscriptionUnsubscribe).toHaveBeenCalled();
    });

    it('should clear debounce timer', fakeAsync(() => {
      service.showLoader();
      // debounce timer is pending
      service.ngOnDestroy();
      
      tick(500);
      // isLoading should still be false because debounce was cleared
      expect(service.isLoading()).toBe(false);
    }));
  });

  describe('edge cases', () => {
    it('should handle rapid show/hide cycles', fakeAsync(() => {
      // Rapid show/hide before debounce
      service.showLoader();
      service.hideLoader();
      service.showLoader();
      service.hideLoader();
      
      tick(300);
      expect(service.isLoading()).toBe(false);
    }));

    it('should handle show after hide correctly', fakeAsync(() => {
      service.showLoader();
      tick(300);
      service.hideLoader();
      
      // Start a new request
      service.showLoader();
      tick(300);
      expect(service.isLoading()).toBe(true);
      
      service.hideLoader();
    }));

    it('should handle multiple forceReset calls', () => {
      service.forceReset();
      service.forceReset();
      service.forceReset();
      
      expect(service.isLoading()).toBe(false);
    });
  });
});
