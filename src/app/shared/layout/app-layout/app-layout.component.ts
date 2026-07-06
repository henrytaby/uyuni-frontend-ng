import { CommonModule, ViewportScroller } from '@angular/common';
import { ChangeDetectionStrategy,Component, effect, inject, signal } from '@angular/core';
import { Event,NavigationEnd, Router, RouterModule } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ProgressBarModule } from 'primeng/progressbar';
import { filter } from 'rxjs';
import { LucideWifi } from '@lucide/angular';

import { LoadingService } from '@core/services/loading.service';
import { NetworkErrorService } from '@core/services/network-error.service';

import { AppHeaderComponent } from '@shared/layout/app-header/app-header.component';
import { AppSidebarComponent } from '@shared/layout/app-sidebar/app-sidebar.component';
import { BackdropComponent } from '@shared/layout/backdrop/backdrop.component';
import { UiSkeletonPageComponent } from '@shared/layout/skeleton-page/ui-skeleton-page.component';
import { SidebarService } from '@shared/services/sidebar.service';

@Component({
  selector: 'app-layout',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    RouterModule,
    AppHeaderComponent,
    AppSidebarComponent,
    BackdropComponent,
    ProgressBarModule,
    DialogModule,
    ButtonModule,
    LucideWifi,
    UiSkeletonPageComponent
  ],
  templateUrl: './app-layout.component.html',
})

export class AppLayoutComponent {
  private sidebarService = inject(SidebarService);
  private router = inject(Router);
  private viewportScroller = inject(ViewportScroller);
  private loadingService = inject(LoadingService);
  private networkErrorService = inject(NetworkErrorService);

  readonly isExpanded = this.sidebarService.isExpanded;
  readonly isHovered = this.sidebarService.isHovered;
  readonly isMobileOpen = this.sidebarService.isMobileOpen;

  readonly isNavigating = this.loadingService.isNavigating;
  

  
  readonly showConnectionError = this.networkErrorService.showConnectionError;
  readonly isCheckingConnection = signal(false);

  constructor() {
    this.router.events.pipe(
      filter((event: Event) => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.viewportScroller.scrollToPosition([0, 0]);
    });

    // Reset checking state if dialog is closed/reset
    effect(() => {
        if (!this.showConnectionError()) {
            this.isCheckingConnection.set(false);
        }
    });
  }

  reloadPage() {
    this.isCheckingConnection.set(true);
    
    this.networkErrorService.checkConnection().subscribe((isOnline) => {
        if (isOnline) {
            window.location.reload();
        } else {
            // Still offline, just stop spinner. Dialog remains open.
            // Maybe show a localized feedback if needed, but the spinner stopping implies "try again"
            this.isCheckingConnection.set(false);
        }
    });
  }
}
