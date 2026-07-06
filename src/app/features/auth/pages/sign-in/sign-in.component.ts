import { ChangeDetectionStrategy,Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '@core/auth/auth.service';
import { AuthErrorHandlerService } from '@core/services/auth-error-handler.service';
import { LoggerService } from '@core/services/logger.service';

import { AuthPageLayoutComponent } from '@features/auth/components/layout/auth-page-layout/auth-page-layout.component';
import { SigninFormComponent } from '@features/auth/components/signin-form/signin-form.component';

/**
 * Sign In Page Component
 * 
 * Smart component that handles user authentication.
 * Uses AuthErrorHandlerService for consistent error handling.
 */
@Component({
  selector: 'app-sign-in',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AuthPageLayoutComponent,
    SigninFormComponent,
  ],
  templateUrl: './sign-in.component.html',
  styles: ``
})
export class SignInComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private authErrorHandler = inject(AuthErrorHandlerService);
  private logger = inject(LoggerService);

  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  /**
   * Handle sign in form submission
   */
  handleSignIn(credentials: { username: string; password: string }): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.authService.login({
      username: credentials.username,
      password: credentials.password
    }).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.logger.info('User logged in successfully', { username: credentials.username }, 'SignInComponent');
        this.router.navigate(['/']);
      },
      error: (error) => {
        this.isLoading.set(false);
        
        // Use AuthErrorHandlerService for consistent error handling
        const authError = this.authErrorHandler.handleLoginError(error);
        
        this.logger.warn('Login failed', { code: authError.code }, 'SignInComponent');
        this.errorMessage.set(authError.message);
      }
    });
  }

  /**
   * Clear the error message
   */
  clearErrorMessage(): void {
    this.errorMessage.set(null);
  }
}
