import { ChangeDetectionStrategy, Component, computed,signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DividerModule } from 'primeng/divider';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';

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
  isLoading = signal(false);

  fname = signal('');
  lname = signal('');
  email = signal('');
  password = signal('');
  isChecked = signal(false);

  isFormValid = computed(() => 
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
      console.log('Registering:', { 
        fname: this.fname(), 
        lname: this.lname(), 
        email: this.email(),
        password: this.password(),
        terms: this.isChecked() 
      });
    }, 1500);
  }
}
