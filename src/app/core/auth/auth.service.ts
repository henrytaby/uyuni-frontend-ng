import { HttpClient, HttpParams } from '@angular/common/http';
import { computed, inject,Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

import { catchError, Observable, of,tap, throwError } from 'rxjs';

import { ConfigService } from '@core/config/config.service';
import { MenuGroup } from '@core/models/menu.models';
import { LoadingService } from '@core/services/loading.service';
import { LoggerService } from '@core/services/logger.service';
import { TokenRefreshService } from '@core/services/token-refresh.service';

import { TokenResponse, User, UserRole } from '@features/auth/models/auth.models';

/**
 * AuthService manages user authentication state and operations.
 * 
 * Responsibilities:
 * - User login/logout
 * - Token management
 * - User profile and roles
 * - Menu navigation based on roles
 * 
 * Uses Signals for reactive state management.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private configService = inject(ConfigService);
  private router = inject(Router);
  private loadingService = inject(LoadingService);
  private logger = inject(LoggerService);
  private tokenRefreshService = inject(TokenRefreshService);

  // State Signals
  private userSignal = signal<User | null>(null);
  private rolesSignal = signal<UserRole[]>([]);
  private tokenSignal = signal<string | null>(localStorage.getItem('access_token'));
  private activeRoleSignal = signal<UserRole | null>(null);
  
  // Computed signals
  readonly currentUser = this.userSignal.asReadonly();
  readonly currentRoles = this.rolesSignal.asReadonly();
  readonly isAuthenticated = computed(() => !!this.tokenSignal());
  readonly activeRole = this.activeRoleSignal.asReadonly();
  
  private menuSignal = signal<MenuGroup[]>([]);
  readonly currentMenu = this.menuSignal.asReadonly();

  private loadingRolesSignal = signal<boolean>(false);
  readonly isLoadingRoles = this.loadingRolesSignal.asReadonly();

  constructor() {
    // Attempt to restore session if token exists.
    // ConfigService is guaranteed to be ready because it uses HttpBackend and is loaded via APP_INITIALIZER
    if (this.tokenSignal()) {
      // Defer execution to allow AuthService to fully construct before AuthInterceptor tries to inject it
      setTimeout(() => this.refreshProfile(), 0);
    }
  }

  /**
   * Authenticate user with credentials
   */
  login(credentials: { username: string; password: string }): Observable<TokenResponse> {
    const config = this.configService.config();
    
    // Mock Auth for development if enabled
    if (config?.featureFlags?.mockAuth) {
      this.setSession('mock-access-token', 'mock-refresh-token');
      this.userSignal.set({ 
        id: 1, 
        username: credentials.username, 
        email: 'admin@example.com', 
        is_verified: true, 
        first_name: 'Mock', 
        last_name: 'Admin' 
      });
      this.logger.info('Mock login successful', { username: credentials.username }, 'AuthService');
      return of({ access_token: 'mock-access-token', refresh_token: 'mock-refresh-token', token_type: 'bearer' });
    }

    const url = `${this.configService.apiUrl}/auth/login`;
    const body = new URLSearchParams();
    body.set('username', credentials.username);
    body.set('password', credentials.password);

    return this.http.post<TokenResponse>(url, body.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }).pipe(
      tap(response => {
        this.setSession(response.access_token, response.refresh_token);
        this.logger.info('User logged in successfully', { username: credentials.username }, 'AuthService');
        // Immediately fetch profile and roles to populate UI state signals
        this.refreshProfile();
      })
    );
  }

  /**
   * Logout user and clear session
   */
  logout(): void {
    const refreshToken = localStorage.getItem('refresh_token');
    const url = `${this.configService.apiUrl}/auth/logout`;

    if (refreshToken) {
      this.loadingService.forceReset();
      this.http.post(url, { refresh_token: refreshToken }).subscribe({
        next: () => {
          this.logger.info('User logged out successfully', undefined, 'AuthService');
          this.clearSession();
        },
        error: () => {
          this.logger.warn('Logout request failed, clearing session anyway', undefined, 'AuthService');
          this.clearSession();
        }
      });
    } else {
      this.clearSession();
    }
  }

  /**
   * Refresh the access token
   * Delegates to TokenRefreshService for separation of concerns
   */
  refreshToken(): Observable<TokenResponse> {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      this.logger.warn('No refresh token available', undefined, 'AuthService');
      return throwError(() => new Error('No refresh token available'));
    }

    const url = `${this.configService.apiUrl}/auth/refresh`;
    const params = new HttpParams().set('refresh_token', refreshToken);

    return this.http.post<TokenResponse>(url, {}, { params }).pipe(
      tap(response => {
        this.setSession(response.access_token, response.refresh_token);
        this.logger.debug('Token refreshed successfully', undefined, 'AuthService');
      }),
      catchError(err => {
        this.logger.error('Token refresh failed', err, 'AuthService');
        this.clearSession();
        return throwError(() => err);
      })
    );
  }

  /**
   * Fetch user roles from backend
   */
  fetchRoles(): void {
    this.loadingRolesSignal.set(true);
    this.http.get<UserRole[]>(`${this.configService.apiUrl}/auth/me/roles`).subscribe({
      next: (roles) => {
        this.rolesSignal.set(roles);
        this.logger.debug('Roles fetched successfully', { count: roles.length }, 'AuthService');
        
        // Handle Active Role Persistence
        if (roles.length > 0) {
          const storedSlug = localStorage.getItem('active_role_slug');
          const matchedRole = roles.find(r => r.slug === storedSlug);

          if (matchedRole) {
            this.setActiveRole(matchedRole, false);
          } else {
            // Default to first role if no stored slug or mismatch
            this.setActiveRole(roles[0], false);
          }
        } else {
          this.activeRoleSignal.set(null);
        }
        this.loadingRolesSignal.set(false);
      },
      error: (err) => {
        this.logger.error('Error fetching roles', err, 'AuthService');
        this.loadingRolesSignal.set(false);
      }
    });
  }

  /**
   * Set the active role for the current session
   */
  setActiveRole(role: UserRole, navigate = true): void {
    this.activeRoleSignal.set(role);
    localStorage.setItem('active_role_slug', role.slug);
    this.fetchMenu(role.slug);
    this.logger.info('Active role changed', { role: role.name }, 'AuthService');
    
    if (navigate) {
      this.router.navigate(['/']);
    }
  }

  /**
   * Refresh user profile from backend
   */
  private refreshProfile(): void {
    this.http.get<User>(`${this.configService.apiUrl}/auth/me`).subscribe({
      next: (user) => {
        this.userSignal.set(user);
        this.logger.debug('User profile refreshed', { username: user.username }, 'AuthService');
      },
      error: (err) => {
        this.logger.error('Error fetching profile', err, 'AuthService');
        if (err.status === 401 || err.status === 403) {
          this.logout();
        }
      }
    });

    this.fetchRoles();
  }

  /**
   * Store tokens in localStorage and update signal
   */
  private setSession(accessToken: string, refreshToken: string): void {
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
    this.tokenSignal.set(accessToken);
  }

  /**
   * Clear all session data
   */
  private clearSession(): void {
    this.loadingService.forceReset();
    this.tokenRefreshService.reset();
    
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('active_role_slug');
    
    this.tokenSignal.set(null);
    this.userSignal.set(null);
    this.rolesSignal.set([]);
    this.activeRoleSignal.set(null);
    this.menuSignal.set([]);
    
    this.logger.info('Session cleared', undefined, 'AuthService');
    this.router.navigate(['/signin']);
  }

  /**
   * Fetch menu items for a specific role
   */
  fetchMenu(roleSlug: string): void {
    this.http.get<MenuGroup[]>(`${this.configService.apiUrl}/auth/me/menu/${roleSlug}`).subscribe({
      next: (menu) => {
        this.menuSignal.set(menu);
        this.logger.debug('Menu fetched successfully', { roleSlug, items: menu.length }, 'AuthService');
      },
      error: (err) => {
        this.logger.error('Error fetching menu', err, 'AuthService');
        this.menuSignal.set([]);
      }
    });
  }

  /**
   * Get the current access token
   */
  getToken(): string | null {
    return this.tokenSignal();
  }
}
