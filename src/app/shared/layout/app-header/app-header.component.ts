import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy,Component, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { LucideDynamicIcon,LucideEllipsis, LucideMenu, LucideX } from '@lucide/angular';

import { AuthService } from '@core/auth/auth.service';

import { RoleSelectorComponent } from '@shared/components/header/role-selector/role-selector.component';
import { ThemeToggleButtonComponent } from '@shared/components/header/theme-toggle/theme-toggle-button.component';
import { UserDropdownComponent } from '@shared/components/header/user-dropdown/user-dropdown.component';
import { IconRegistryService } from '@shared/services/icon-registry.service';
import { SidebarService } from '@shared/services/sidebar.service';

@Component({
  selector: 'app-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    RouterModule,
    ButtonModule,
    LucideMenu,
    LucideX,
    LucideEllipsis,
    LucideDynamicIcon,
    ThemeToggleButtonComponent,
    UserDropdownComponent,
    RoleSelectorComponent
  ],
  templateUrl: './app-header.component.html',
})
export class AppHeaderComponent {
  isApplicationMenuOpen = signal(false);

  public sidebarService = inject(SidebarService);
  private authService = inject(AuthService);
  readonly iconRegistry = inject(IconRegistryService);
  
  readonly isMobileOpen = this.sidebarService.isMobileOpen;

  // Active Role is still needed for display in header
  selectedRole = this.authService.activeRole;

  handleToggle() {
    this.sidebarService.toggleSmart();
  }

  toggleApplicationMenu() {
    this.isApplicationMenuOpen.update((prev: boolean) => !prev);
  }
}
