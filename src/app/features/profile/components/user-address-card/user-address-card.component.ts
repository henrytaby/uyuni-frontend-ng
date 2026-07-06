import { ChangeDetectionStrategy,Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-user-address-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    DialogModule,
    ButtonModule,
    InputTextModule
  ],
  templateUrl: './user-address-card.component.html',
  styles: ``
})
export class UserAddressCardComponent {

  isOpen = false;
  openModal() { this.isOpen = true; }
  closeModal() { this.isOpen = false; }

  address = {
    country: 'United States.',
    cityState: 'Phoenix, Arizona, United States.',
    postalCode: 'ERT 2489',
    taxId: 'AS4568384',
  };

  handleSave() {
    // Handle save logic here
    console.log('Saving changes...');
    this.closeModal();
  }
}
