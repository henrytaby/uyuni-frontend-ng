import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/overview/profile.component').then(m => m.ProfileComponent),
    title: 'Perfil | Enterprise Admin'
  }
];
