import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { Tooltip } from 'primeng/tooltip';
import { LucideMoon, LucideSun } from '@lucide/angular';

import { ThemeService } from '@shared/services/theme.service';

@Component({
  selector: 'app-theme-toggle-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './theme-toggle-button.component.html',
  imports: [CommonModule, Tooltip, LucideSun, LucideMoon]
})
export class ThemeToggleButtonComponent {
  
  private themeService = inject(ThemeService);
  theme$ = this.themeService.theme$;

  toggleTheme() {
    this.themeService.toggleTheme();
  }
}
