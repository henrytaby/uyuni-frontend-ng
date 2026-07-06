import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';

import { AuthService } from '@core/auth/auth.service';

import { authGuard } from './auth.guard';

describe('authGuard', () => {
  let mockAuthService: jest.Mocked<AuthService>;
  let mockRouter: jest.Mocked<Router>;
  let mockRoute: ActivatedRouteSnapshot;
  let mockState: RouterStateSnapshot;

  beforeEach(() => {
    // Create mocks
    mockAuthService = {
      isAuthenticated: jest.fn(),
    } as unknown as jest.Mocked<AuthService>;

    mockRouter = {
      navigate: jest.fn(),
      parseUrl: jest.fn((url: string) => ({ url })),
    } as unknown as jest.Mocked<Router>;

    mockRoute = {} as ActivatedRouteSnapshot;
    mockState = { url: '/protected' } as RouterStateSnapshot;

    // Configure TestBed
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
      ],
    });
  });

  describe('when user is authenticated', () => {
    it('should return true', () => {
      // Arrange
      mockAuthService.isAuthenticated.mockReturnValue(true);

      // Act
      const result = TestBed.runInInjectionContext(() => 
        authGuard(mockRoute, mockState)
      );

      // Assert
      expect(result).toBe(true);
      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });
  });

  describe('when user is not authenticated', () => {
    it('should return false and navigate to signin', () => {
      // Arrange
      mockAuthService.isAuthenticated.mockReturnValue(false);

      // Act
      const result = TestBed.runInInjectionContext(() => 
        authGuard(mockRoute, mockState)
      );

      // Assert
      expect(result).toBe(false);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/signin']);
    });

    it('should call router.navigate with correct route', () => {
      // Arrange
      mockAuthService.isAuthenticated.mockReturnValue(false);

      // Act
      TestBed.runInInjectionContext(() => authGuard(mockRoute, mockState));

      // Assert
      expect(mockRouter.navigate).toHaveBeenCalledTimes(1);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/signin']);
    });
  });

  describe('authentication check', () => {
    it('should call isAuthenticated exactly once', () => {
      // Arrange
      mockAuthService.isAuthenticated.mockReturnValue(true);

      // Act
      TestBed.runInInjectionContext(() => authGuard(mockRoute, mockState));

      // Assert
      expect(mockAuthService.isAuthenticated).toHaveBeenCalledTimes(1);
    });

    it('should not call router.navigate when authenticated', () => {
      // Arrange
      mockAuthService.isAuthenticated.mockReturnValue(true);

      // Act
      TestBed.runInInjectionContext(() => authGuard(mockRoute, mockState));

      // Assert
      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });
  });

  describe('edge cases', () => {
    it('should handle multiple calls independently', () => {
      // First call - authenticated
      mockAuthService.isAuthenticated.mockReturnValue(true);
      const result1 = TestBed.runInInjectionContext(() => 
        authGuard(mockRoute, mockState)
      );
      expect(result1).toBe(true);

      // Second call - not authenticated
      mockAuthService.isAuthenticated.mockReturnValue(false);
      const result2 = TestBed.runInInjectionContext(() => 
        authGuard(mockRoute, mockState)
      );
      expect(result2).toBe(false);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/signin']);
    });

    it('should work when isAuthenticated returns truthy value (not strictly boolean)', () => {
      // Arrange - some implementations might return truthy values
      mockAuthService.isAuthenticated.mockReturnValue(1 as unknown as boolean);

      // Act
      const result = TestBed.runInInjectionContext(() => 
        authGuard(mockRoute, mockState)
      );

      // Assert - guard returns true (truthy is coerced to true in the if statement)
      expect(result).toBe(true);
      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });

    it('should work when isAuthenticated returns falsy value (not strictly false)', () => {
      // Arrange
      mockAuthService.isAuthenticated.mockReturnValue(0 as unknown as boolean);

      // Act
      const result = TestBed.runInInjectionContext(() => 
        authGuard(mockRoute, mockState)
      );

      // Assert - guard returns false (falsy is coerced to false in the if statement)
      expect(result).toBe(false);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/signin']);
    });
  });
});
