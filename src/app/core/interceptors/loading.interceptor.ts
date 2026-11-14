import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

import { finalize } from 'rxjs';

import { LoadingService } from '@core/services/loading.service';

export const SKIP_LOADER_HEADER = 'X-Skip-Loader';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);

  // 1. Omitir loader global para peticiones con encabezado explícito 'X-Skip-Loader'
  if (req.headers.has(SKIP_LOADER_HEADER) || req.headers.has('x-skip-loader')) {
    const cleanReq = req.clone({
      headers: req.headers.delete(SKIP_LOADER_HEADER).delete('x-skip-loader')
    });
    return next(cleanReq);
  }

  // 2. Omitir loader global para endpoints con su propio indicador local (ej. Copiloto IA de Comercio)
  if (req.url.includes('/commerce/assistant/')) {
    return next(req);
  }

  // 3. No bloquear la UI para peticiones de assets estáticos (svg, png, json, etc)
  const assetRegex = /\.(svg|png|jpg|jpeg|gif|ico|webp|mp4|webm|css|js|json|woff2?|map|manifest)(\?.*|#.*)?$/i;
  const isAsset = req.url.includes('/assets/') || assetRegex.test(req.url);

  if (isAsset) {
    return next(req);
  }

  loadingService.showLoader();

  return next(req).pipe(
    finalize(() => loadingService.hideLoader())
  );
};
