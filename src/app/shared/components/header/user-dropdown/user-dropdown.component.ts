import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy,Component, computed, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';

import { LucideCircleQuestionMark, LucideLogOut,LucideSettings, LucideSquareUserRound } from '@lucide/angular';

import { AuthService } from '@core/auth/auth.service';

import { DropdownComponent } from '@shared/components/ui/dropdown/dropdown.component';
import { DropdownItemComponent } from '@shared/components/ui/dropdown/dropdown-item/dropdown-item.component';

@Component({
  selector: 'app-user-dropdown',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './user-dropdown.component.html',
  imports:[CommonModule,RouterModule,DropdownComponent,DropdownItemComponent,LucideSquareUserRound,LucideSettings,LucideCircleQuestionMark,LucideLogOut]
})
export class UserDropdownComponent {
  private authService = inject(AuthService);
  currentUser = this.authService.currentUser;
  
  userInitials = computed(() => {
    const user = this.currentUser();
    if (!user) return '';
    const first = user.first_name ? user.first_name.charAt(0).toUpperCase() : '';
    const last = user.last_name ? user.last_name.charAt(0).toUpperCase() : '';
    return `${first}${last}`;
  });

  isOpen = signal(false);

  toggleDropdown() {
    this.isOpen.update(prev => !prev);
  }

  closeDropdown() {
    this.isOpen.set(false);
  }

  handleLogout() {
    this.authService.logout();
    this.closeDropdown();
  }
}