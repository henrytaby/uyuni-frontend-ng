import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'signin',
    loadComponent: () => import('./pages/sign-in/sign-in.component').then(m => m.SignInComponent),
    title: 'Sign In | Enterprise Admin'
  },
  {
    path: 'signup',
    loadComponent: () => import('./pages/sign-up/sign-up.component').then(m => m.SignUpComponent),
    title: 'Sign Up | Enterprise Admin'
  }
];
