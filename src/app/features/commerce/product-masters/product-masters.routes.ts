import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/product-master-list/product-master-list.component').then(
        m => m.ProductMasterListComponent
      ),
    title: 'Catálogo Maestro | UyuniAdmin'
  }
];

