import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/batch-list/batch-list.component').then(
        m => m.BatchListComponent
      ),
    title: 'Lotes y Cajas | UyuniAdmin'
  }
];

