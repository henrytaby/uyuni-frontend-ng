import { HttpHeaders, HttpRequest, HttpResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { of } from 'rxjs';

import { LoadingService } from '@core/services/loading.service';

import { loadingInterceptor, SKIP_LOADER_HEADER } from './loading.interceptor';

describe('loadingInterceptor', () => {
  let mockLoadingService: jest.Mocked<LoadingService>;
  let mockHandler: jest.Mock;

  const createRequest = (url: string, headers = new HttpHeaders()): HttpRequest<unknown> => {
    return new HttpRequest<unknown>('GET', url, null, { headers });
  };

  beforeEach(() => {
    mockLoadingService = {
      showLoader: jest.fn(),
      hideLoader: jest.fn()
    } as unknown as jest.Mocked<LoadingService>;

    mockHandler = jest.fn().mockReturnValue(of(new HttpResponse({ status: 200 })));

    TestBed.configureTestingModule({
      providers: [{ provide: LoadingService, useValue: mockLoadingService }]
    });
  });

  it('should show and hide loader for normal API requests', (done) => {
    const req = createRequest('/api/commerce/products');

    TestBed.runInInjectionContext(() => {
      const result$ = loadingInterceptor(req, mockHandler);
      expect(mockLoadingService.showLoader).toHaveBeenCalled();

      result$.subscribe({
        complete: () => {
          setTimeout(() => {
            expect(mockLoadingService.hideLoader).toHaveBeenCalled();
            done();
          }, 0);
        }
      });
    });
  });

  it('should skip loader when request has X-Skip-Loader header and strip the header', done => {
    const headers = new HttpHeaders().set(SKIP_LOADER_HEADER, 'true');
    const req = createRequest('/api/commerce/assistant/chat', headers);

    TestBed.runInInjectionContext(() => {
      const result$ = loadingInterceptor(req, mockHandler);
      result$.subscribe({
        complete: () => {
          expect(mockLoadingService.showLoader).not.toHaveBeenCalled();
          const forwardedReq = mockHandler.mock.calls[0][0] as HttpRequest<unknown>;
          expect(forwardedReq.headers.has(SKIP_LOADER_HEADER)).toBe(false);
          done();
        }
      });
    });
  });

  it('should skip loader for commerce assistant endpoints automatically', done => {
    const req = createRequest('/api/commerce/assistant/chat');

    TestBed.runInInjectionContext(() => {
      const result$ = loadingInterceptor(req, mockHandler);
      result$.subscribe({
        complete: () => {
          expect(mockLoadingService.showLoader).not.toHaveBeenCalled();
          done();
        }
      });
    });
  });

  it('should skip loader for static asset requests', done => {
    const req = createRequest('/assets/images/logo.png');

    TestBed.runInInjectionContext(() => {
      const result$ = loadingInterceptor(req, mockHandler);
      result$.subscribe({
        complete: () => {
          expect(mockLoadingService.showLoader).not.toHaveBeenCalled();
          done();
        }
      });
    });
  });
});
