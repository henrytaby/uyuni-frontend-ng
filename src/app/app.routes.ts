import { Routes } from '@angular/router';

import { authGuard } from '@core/guards/auth.guard';

import { AppLayoutComponent } from '@shared/layout/app-layout/app-layout.component';

export const routes: Routes = [

  {
    path: '',
    component: AppLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadChildren: () => import('@features/dashboard/dashboard.routes').then(m => m.routes),
      },
      {
        path: 'profile',
        loadChildren: () => import('@features/profile/profile.routes').then(m => m.routes),
      },
      {
        path: 'blank',
        loadComponent: () => import('@features/system/pages/blank/blank.component').then(m => m.BlankComponent),
        title: 'Blank | Enterprise Admin'
      },
      {
        path: 'staff',
        loadChildren: () => import('@features/staff/staff.routes').then(m => m.routes),
      },
      {
        path: 'users',
        loadChildren: () => import('@features/users/user.routes').then(m => m.routes),
      },
    ]
  },
  {
    path: '',
    loadChildren: () => import('@features/auth/auth.routes').then(m => m.routes)
  },

  {
    path: '**',
    loadComponent: () => import('@features/system/pages/not-found/not-found.component').then(m => m.NotFoundComponent),
    title: 'Not Found | Enterprise Admin'
  },
];
