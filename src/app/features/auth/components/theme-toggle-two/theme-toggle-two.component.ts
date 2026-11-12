import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { LucideMoon, LucideSun } from '@lucide/angular';

import { ThemeService } from '@shared/services/theme.service';

@Component({
  selector: 'app-theme-toggle-two',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AsyncPipe, LucideSun, LucideMoon],
  templateUrl: './theme-toggle-two.component.html',
  styles: ``
})
export class ThemeToggleTwoComponent {
  private readonly themeService = inject(ThemeService);
  readonly theme$ = this.themeService.theme$;

  toggleTheme() {
    this.themeService.toggleTheme();
  }
}
