import { decodeJwt, isJwtExpired } from './jwt.utils';

describe('jwt.utils', () => {
  const createMockJwt = (payload: object): string => {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const body = btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
    return `${header}.${body}.mock-signature`;
  };

  describe('decodeJwt', () => {
    it('should return null for null, undefined, or empty token', () => {
      expect(decodeJwt(null)).toBeNull();
      expect(decodeJwt('')).toBeNull();
      expect(decodeJwt(undefined as unknown as string)).toBeNull();
    });

    it('should return null for non-JWT strings', () => {
      expect(decodeJwt('not-a-jwt')).toBeNull();
      expect(decodeJwt('part1.part2')).toBeNull();
      expect(decodeJwt('part1.part2.part3.part4')).toBeNull();
    });

    it('should decode payload with standard claims', () => {
      const payload = { sub: 'user-123', exp: 1999999999, role: 'admin' };
      const token = createMockJwt(payload);
      const decoded = decodeJwt(token);

      expect(decoded).toEqual(payload);
    });

    it('should decode UTF-8 characters correctly', () => {
      const payload = { name: 'José Pérez María' };
      const token = createMockJwt(payload);
      const decoded = decodeJwt(token);

      expect(decoded).toEqual(payload);
    });
  });

  describe('isJwtExpired', () => {
    it('should return true for null or empty token', () => {
      expect(isJwtExpired(null)).toBe(true);
      expect(isJwtExpired('')).toBe(true);
    });

    it('should return false for tokens without 3 parts (e.g. mock test tokens)', () => {
      expect(isJwtExpired('mock-access-token')).toBe(false);
      expect(isJwtExpired('test-token')).toBe(false);
    });

    it('should return true for token with exp in the past', () => {
      const pastExp = Math.floor(Date.now() / 1000) - 3600; // 1 hour ago
      const token = createMockJwt({ exp: pastExp });
      expect(isJwtExpired(token)).toBe(true);
    });

    it('should return false for token with exp far in the future', () => {
      const futureExp = Math.floor(Date.now() / 1000) + 7200; // 2 hours ahead
      const token = createMockJwt({ exp: futureExp });
      expect(isJwtExpired(token)).toBe(false);
    });

    it('should consider buffer seconds (token expiring within 10s is considered expired)', () => {
      const soonExp = Math.floor(Date.now() / 1000) + 5; // expires in 5s
      const token = createMockJwt({ exp: soonExp });
      expect(isJwtExpired(token, 10)).toBe(true);
    });

    it('should return false if token does not have an exp claim', () => {
      const token = createMockJwt({ sub: 'user-without-exp' });
      expect(isJwtExpired(token)).toBe(false);
    });
  });
});

