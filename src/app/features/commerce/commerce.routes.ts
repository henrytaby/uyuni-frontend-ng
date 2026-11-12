import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'product-masters',
    pathMatch: 'full'
  },
  {
    path: 'product-masters',
    loadChildren: () =>
      import('./product-masters/product-masters.routes').then(m => m.routes)
  }
];

