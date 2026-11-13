import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'products',
    pathMatch: 'full'
  },
  {
    path: 'products',
    loadChildren: () =>
      import('./products/products.routes').then(m => m.routes)
  },
  {
    path: 'product-masters',
    loadChildren: () =>
      import('./product-masters/product-masters.routes').then(m => m.routes)
  },
  {
    path: 'batches',
    loadChildren: () =>
      import('./batches/batches.routes').then(m => m.routes)
  },
  {
    path: 'sales',
    loadChildren: () =>
      import('./sales/sales.routes').then(m => m.routes)
  },
  {
    path: 'catalogs',
    loadChildren: () =>
      import('./catalogs/catalogs.routes').then(m => m.routes)
  }
];

