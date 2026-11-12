import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DividerModule } from 'primeng/divider';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';

import { LoggerService } from '@core/services/logger.service';

@Component({
  selector: 'app-signup-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    RouterModule,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    CheckboxModule,
    FloatLabelModule,
    DividerModule
  ],
  templateUrl: './signup-form.component.html',
  styles: `
    :host {
      display: flex;
      flex: 1;
      width: 100%;
    }
  `
})
export class SignupFormComponent {
  private readonly logger = inject(LoggerService);

  readonly isLoading = signal(false);

  readonly fname = signal('');
  readonly lname = signal('');
  readonly email = signal('');
  readonly password = signal('');
  readonly isChecked = signal(false);

  readonly isFormValid = computed(() => 
    this.fname().trim().length > 0 && 
    this.lname().trim().length > 0 && 
    this.email().trim().length > 0 && 
    this.password().trim().length >= 6 && 
    this.isChecked()
  );

  onRegister() {
    if (!this.isFormValid()) return;
    
    this.isLoading.set(true);
    // Simulate API call
    setTimeout(() => {
      this.isLoading.set(false);
      this.logger.info('Registering attempt', { 
        fname: this.fname(), 
        lname: this.lname(), 
        email: this.email(),
        terms: this.isChecked() 
      });
    }, 1500);
  }
}
