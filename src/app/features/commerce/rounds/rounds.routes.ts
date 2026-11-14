import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/round-list/round-list.component').then(
        m => m.RoundListComponent
      ),
    title: 'Rondas de Inversión | UyuniAdmin'
  }
];
