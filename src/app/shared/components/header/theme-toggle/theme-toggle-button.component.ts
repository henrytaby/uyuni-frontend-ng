import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy,Component, inject } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { LucideMoon, LucideSun } from '@lucide/angular';

import { ThemeService } from '@shared/services/theme.service';

@Component({
  selector: 'app-theme-toggle-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './theme-toggle-button.component.html',
  imports:[CommonModule, ButtonModule, LucideSun, LucideMoon]
})
export class ThemeToggleButtonComponent {
  
  private themeService = inject(ThemeService);
  theme$ = this.themeService.theme$;

  toggleTheme() {
    this.themeService.toggleTheme();
  }
}