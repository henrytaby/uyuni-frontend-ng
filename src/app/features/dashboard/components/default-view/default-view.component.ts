import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-default-view',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-white/5">
      <h2 class="text-xl font-bold text-gray-800 dark:text-white/90">Bienvenido</h2>
      <p class="mt-2 text-gray-600 dark:text-gray-400">Seleccione un rol válido para visualizar el panel correspondiente.</p>
    </div>
  `
})
export class DefaultViewComponent {}
