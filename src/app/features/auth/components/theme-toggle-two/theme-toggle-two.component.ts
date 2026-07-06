import { ChangeDetectionStrategy,Component, inject } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { LucideMoon,LucideSun } from '@lucide/angular';

import { ThemeService } from '@shared/services/theme.service';

@Component({
  selector: 'app-theme-toggle-two',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonModule, LucideSun, LucideMoon],
  templateUrl: './theme-toggle-two.component.html',
  styles: ``
})
export class ThemeToggleTwoComponent {

  private themeService = inject(ThemeService);
  theme$ = this.themeService.theme$;

  toggleTheme() {
    this.themeService.toggleTheme();
  }
}
