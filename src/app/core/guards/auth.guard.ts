import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { catchError, map, of } from 'rxjs';

import { AuthService } from '@core/auth/auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // 1. Si el usuario ya posee una sesión válida con token de acceso vigente
  const isSessionValid = typeof authService.hasValidSession === 'function'
    ? authService.hasValidSession()
    : authService.isAuthenticated();

  if (isSessionValid) {
    return true;
  }

  // 2. Si el token de acceso caducó pero el refresh token está vigente, restaurar antes de entrar
  if (typeof authService.canRestoreSession === 'function' && authService.canRestoreSession()) {
    return authService.restoreSession().pipe(
      map(success => {
        if (success) {
          return true;
        }
        router.navigate(['/signin']);
        return false;
      }),
      catchError(() => {
        router.navigate(['/signin']);
        return of(false);
      })
    );
  }

  // 3. Sin sesión activa: limpiar credenciales obsoletas y redirigir al inicio de sesión
  if (typeof authService.clearSession === 'function') {
    authService.clearSession(false);
  }
  router.navigate(['/signin']);
  return false;
};
