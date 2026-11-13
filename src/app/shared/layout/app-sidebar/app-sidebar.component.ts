import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  OnDestroy,
  OnInit,
  signal
} from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';

import { Tooltip } from 'primeng/tooltip';
import { filter, Subscription } from 'rxjs';
import { LucideChevronDown, LucideChevronLeft, LucideChevronRight, LucideDynamicIcon } from '@lucide/angular';

import { AuthService } from '@core/auth/auth.service';

import { IconRegistryService } from '@shared/services/icon-registry.service';
import { SidebarService } from '@shared/services/sidebar.service';

interface NavItem {
  name: string;
  slug?: string;
  path?: string;
  subItems?: { name: string; path: string }[];
}

@Component({
  selector: 'app-sidebar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    RouterModule,
    Tooltip,
    LucideChevronDown,
    LucideChevronLeft,
    LucideChevronRight,
    LucideDynamicIcon
  ],
  templateUrl: './app-sidebar.component.html',
})
export class AppSidebarComponent implements OnInit, OnDestroy, AfterViewInit {

  public sidebarService = inject(SidebarService);
  private router = inject(Router);
  private authService = inject(AuthService);
  readonly iconRegistry = inject(IconRegistryService);

  currentMenu = this.authService.currentMenu;

  navItems = computed<NavItem[]>(() => {
    const rawMenu = this.currentMenu();

    const homeItem: NavItem = {
      name: 'Inicio',
      slug: 'home',
      path: '/'
    };

    const dynamicItems = rawMenu.map(group => ({
        name: group.group_name,
        slug: group.slug,
        subItems: group.modules.map(module => ({
          name: module.name,
          path: `/${module.route}`,
        }))
      }));

    return [homeItem, ...dynamicItems];
  });

  openSubmenu = signal<string | null>(null);
  subMenuHeights = signal<Record<string, number>>({});

  readonly isExpanded = this.sidebarService.isExpanded;
  readonly isMobileOpen = this.sidebarService.isMobileOpen;
  readonly isHovered = this.sidebarService.isHovered;

  // Computed for consolidated view state
  readonly isVisible = computed(() => this.isExpanded() || this.isHovered() || this.isMobileOpen());

  private routeSubscription?: Subscription;

  constructor() {
    effect(() => {
      // Reaccionar cuando navItems se pueble desde el backend tras F5
      const items = this.navItems();
      if (items.length > 1) {
        setTimeout(() => {
          this.setActiveMenuFromRoute();
        });
      }
    });
  }

  ngOnInit() {
    this.routeSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.setActiveMenuFromRoute();
    });
  }
  
  ngAfterViewInit() {
    setTimeout(() => {
      this.setActiveMenuFromRoute();
    });
  }

  ngOnDestroy() {
    this.routeSubscription?.unsubscribe();
  }

  isActive(path?: string): boolean {
    if (!path) return false;
    if (path === '/') return this.router.url === '/';
    return this.router.url === path || this.router.url.startsWith(path + '/') || this.router.url.startsWith(path + '?');
  }

  isParentActive(nav: NavItem): boolean {
    if (!nav.subItems) return false;
    return nav.subItems.some(sub => this.isActive(sub.path));
  }

  toggleSubmenu(section: string, index: number) {
    const key = `${section}-${index}`;

    if (this.openSubmenu() === key) {
      this.openSubmenu.set(null);
      this.subMenuHeights.update(heights => ({ ...heights, [key]: 0 }));
    } else {
      this.openSubmenu.set(key);

      setTimeout(() => {
        if (typeof document !== 'undefined') {
          const el = document.getElementById(key);
          if (el) {
            this.subMenuHeights.update(heights => ({ ...heights, [key]: el.scrollHeight }));
          }
        }
      });
    }
  }

  onSidebarMouseEnter() {
    if (!this.isExpanded()) {
      this.sidebarService.setHovered(true);
    }
  }

  private setActiveMenuFromRoute() {
    let matchedKey: string | null = null;

    this.navItems().forEach((nav, i) => {
      if (nav.subItems) {
        const hasActiveChild = nav.subItems.some(subItem => this.isActive(subItem.path));
        if (hasActiveChild) {
          matchedKey = `main-${i}`;
        }
      }
    });

    if (matchedKey) {
      const key = matchedKey;
      this.openSubmenu.set(key);

      setTimeout(() => {
        if (typeof document !== 'undefined') {
          const el = document.getElementById(key);
          if (el) {
            this.subMenuHeights.update(heights => ({ ...heights, [key]: el.scrollHeight }));
          }
        }
      });
    } else {
      this.openSubmenu.set(null);
    }
  }

  onSubmenuClick() {
    if (this.isMobileOpen()) {
      this.sidebarService.setMobileOpen(false);
    }
  }  
}
