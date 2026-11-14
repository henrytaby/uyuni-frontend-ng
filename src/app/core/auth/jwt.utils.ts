/**
 * Utilidades para decodificación e inspección de JSON Web Tokens (JWT)
 * sin requerir dependencias externas pesadas.
 */

export interface JwtPayload {
  exp?: number;
  iat?: number;
  sub?: string;
  [key: string]: unknown;
}

/**
 * Decodifica de forma segura la carga útil (payload) de un JWT estándar de 3 partes.
 * Retorna null si el formato no es válido o no corresponde a un JWT.
 */
export function decodeJwt(token: string | null): JwtPayload | null {
  if (!token || typeof token !== 'string') {
    return null;
  }

  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    let base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4 !== 0) {
      base64 += '=';
    }

    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    return JSON.parse(jsonPayload) as JwtPayload;
  } catch {
    return null;
  }
}

/**
 * Verifica si un token JWT ha expirado.
 * 
 * - Si el token es null/vacío -> true (expirado/inválido).
 * - Si el token no es un JWT estándar de 3 partes (ej. tokens mock de testing) -> false (no evaluable).
 * - Si tiene campo `exp` -> evalúa contra el timestamp actual con un margen de seguridad de 10s.
 */
export function isJwtExpired(token: string | null, bufferSeconds = 10): boolean {
  if (!token) {
    return true;
  }

  const payload = decodeJwt(token);
  // Si no es un JWT con formato estándar o no tiene exp (ej: tokens de prueba unitaria), no lo marcamos como expirado
  if (!payload || typeof payload.exp !== 'number') {
    return false;
  }

  const nowInSeconds = Math.floor(Date.now() / 1000);
  return nowInSeconds >= (payload.exp - bufferSeconds);
}

