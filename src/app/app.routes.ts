import { Routes } from '@angular/router';
import { authGuard, publicGuard } from './guards/auth-guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./components/login/login.component')
      .then((m) => m.LoginComponent),
    canActivate: [publicGuard],
  },
  {
    path: 'admin',
    loadComponent: () =>
      import('./components/admin/admin-layout').then((m) => m.AdminLayout),
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./components/dashboard/dashboard').then((m) => m.Dashboard),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
