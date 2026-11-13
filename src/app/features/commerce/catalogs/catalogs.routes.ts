import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/catalog-hub/catalog-hub.component').then(
        m => m.CatalogHubComponent
      ),
    title: 'Catálogos y Parámetros | UyuniAdmin'
  }
];

