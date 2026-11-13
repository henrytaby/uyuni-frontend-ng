import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/product-list/product-list.component').then(
        m => m.ProductListComponent
      ),
    title: 'Inventario de Productos | UyuniAdmin'
  }
];

