import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { computed,inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

/**
 * BreakpointService centralizes screen size detection logic.
 * Uses Angular CDK BreakpointObserver and Signals for reactivity.
 */
@Injectable({
  providedIn: 'root'
})
export class BreakpointService {
  private breakpointObserver = inject(BreakpointObserver);

  // Define breakpoints following Tailwind / UyuniAdmin standards
  // xl is typically 1280px
  private readonly breakpoints = {
    xs: '(max-width: 639px)',
    sm: Breakpoints.Small,    // 600px - 959px
    md: Breakpoints.Medium,   // 960px - 1279px
    lg: Breakpoints.Large,    // 1280px - 1919px
    xl: Breakpoints.XLarge,   // 1920px+
    // Custom tailwind-like breakpoints
    isXl: '(min-width: 1280px)',
    isLg: '(min-width: 1024px)',
    isMd: '(min-width: 768px)',
  };

  // Convert observer to Signals
  private state = toSignal(this.breakpointObserver.observe([
    this.breakpoints.isXl,
    this.breakpoints.isLg,
    this.breakpoints.isMd,
    Breakpoints.Handset
  ]));

  /**
   * Reactive signal that returns true if screen is Desktop (>= 1280px)
   */
  readonly isDesktop = computed(() => {
    return this.state()?.breakpoints[this.breakpoints.isXl] ?? false;
  });

  /**
   * Reactive signal that returns true if screen is Tablet/Mobile (< 1280px)
   */
  readonly isMobile = computed(() => !this.isDesktop());

  /**
   * Reactive signal for Medium screens (>= 768px)
   */
  readonly isMedium = computed(() => {
    return this.state()?.breakpoints[this.breakpoints.isMd] ?? false;
  });
}
