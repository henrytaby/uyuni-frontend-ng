import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/user-list/user-list.component').then(m => m.UserListComponent),
    title: 'Usuarios | Enterprise Admin'
  }
];
