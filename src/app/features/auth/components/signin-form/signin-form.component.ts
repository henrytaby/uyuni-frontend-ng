import { ChangeDetectionStrategy, Component, computed,EventEmitter, input, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { PasswordModule } from 'primeng/password';
import { LucideCircleAlert } from '@lucide/angular';

@Component({
  selector: 'app-signin-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    FloatLabelModule,
    MessageModule,
    LucideCircleAlert
  ],
  templateUrl: './signin-form.component.html',
  styles: `
    :host {
      display: flex;
      flex: 1;
      width: 100%;
    }
  `
})
export class SigninFormComponent {
  @Output() signIn = new EventEmitter<{ username: string; password: string }>();
  @Output() errorCleared = new EventEmitter<void>();
  
  isLoading = input<boolean>(false);
  errorMessage = input<string | null>(null);

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
