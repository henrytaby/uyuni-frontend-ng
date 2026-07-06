import { inject,Injectable, signal } from '@angular/core';

import { BreakpointService } from '@core/services/breakpoint.service';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  private breakpointService = inject(BreakpointService);

  readonly isExpanded = signal<boolean>(true);
  readonly isMobileOpen = signal<boolean>(false);
  readonly isHovered = signal<boolean>(false);

  setExpanded(val: boolean) {
    this.isExpanded.set(val);
  }

  toggleExpanded() {
    this.isExpanded.update(prev => !prev);
  }

  setMobileOpen(val: boolean) {
    this.isMobileOpen.set(val);
  }

  toggleMobileOpen() {
    this.isMobileOpen.update(prev => !prev);
  }

  /**
   * Unified toggle method that decides which state to change based on screen size
   */
  toggleSmart() {
    if (this.breakpointService.isDesktop()) {
      this.toggleExpanded();
    } else {
      this.toggleMobileOpen();
    }
  }

  setHovered(val: boolean) {
    this.isHovered.set(val);
  }
}
