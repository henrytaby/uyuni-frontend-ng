import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/sale-list/sale-list.component').then(
        m => m.SaleListComponent
      ),
    title: 'Ventas y Transacciones | UyuniAdmin'
  }
];
