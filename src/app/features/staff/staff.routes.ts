import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/staff-list/staff-list.component').then(m => m.StaffListComponent),
    title: 'Personal | Enterprise Admin'
  }
];
