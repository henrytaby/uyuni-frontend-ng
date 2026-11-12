import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { LucideCircleAlert, LucideLock, LucideShieldCheck, LucideUser } from '@lucide/angular';

@Component({
  selector: 'app-signin-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    LucideCircleAlert,
    LucideLock,
    LucideShieldCheck,
    LucideUser
  ],
  templateUrl: './signin-form.component.html',
  styles: `
    :host {
      display: block;
      width: 100%;
    }
  `
})
export class SigninFormComponent {
  readonly signIn = output<{ username: string; password: string }>();
  readonly errorCleared = output<void>();
  
  readonly isLoading = input<boolean>(false);
  readonly errorMessage = input<string | null>(null);

  username = signal('');
  password = signal('');
  localError = signal<string | null>(null);

  isFormValid = computed(() => this.username().trim().length > 0 && this.password().trim().length > 0);

  onSignIn() {
    if (!this.username() || !this.password()) {
       this.localError.set('Por favor, ingrese su usuario y contraseña.');
       return;
    }
    
    if (this.username() && this.password()) {
      this.signIn.emit({ username: this.username(), password: this.password() });
    }
  }

  clearError() {
    this.localError.set(null);
    this.errorCleared.emit();
  }
}
