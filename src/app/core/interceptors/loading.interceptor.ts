import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

import { finalize } from 'rxjs';

import { LoadingService } from '@core/services/loading.service';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);
  
  // No bloquear la UI para peticiones irrelevantes (assets, svg, json, etc)
  // Regex: matches typical static extensions, ignoring case and handling query params/hashes
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
