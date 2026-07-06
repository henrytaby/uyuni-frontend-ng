import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy,Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { SkeletonModule } from 'primeng/skeleton';
import { LucideCircleCheck, LucideDynamicIcon, LucideSearch } from '@lucide/angular';

import { AuthService } from '@core/auth/auth.service';

import { IconRegistryService } from '@shared/services/icon-registry.service';

import { UserRole } from '@features/auth/models/auth.models';

/**
 * RoleSelectorComponent encapsulates the user role selection logic and modal.
 * Follows SRP by decoupling this feature from the main Header.
 */
@Component({
  selector: 'app-role-selector',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormsModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    SkeletonModule,
    LucideDynamicIcon,
    LucideCircleCheck,
    LucideSearch
  ],
  templateUrl: './role-selector.component.html'
})
export class RoleSelectorComponent {
  private authService = inject(AuthService);
  readonly iconRegistry = inject(IconRegistryService);

  isVisible = signal(false);
  searchQuery = signal('');

  // Roles from AuthService
  roles = this.authService.currentRoles;
  isLoading = this.authService.isLoadingRoles;
  selectedRole = this.authService.activeRole;

  filteredRoles = computed(() => {
    const query = this.searchQuery().toLowerCase();
    return this.roles().filter(role => 
      role.name.toLowerCase().includes(query) || 
      role.description?.toLowerCase().includes(query)
    );
  });

  /**
   * Opens the modal and triggers role fetching
   */
  show() {
    this.authService.fetchRoles();
    this.searchQuery.set('');
    this.isVisible.set(true);
  }

  /**
   * Closes the modal
   */
  hide() {
    this.isVisible.set(false);
  }

  /**
   * Selects a role and closes the modal
   */
  selectRole(role: UserRole) {
    this.authService.setActiveRole(role);
    this.hide();
  }
}
