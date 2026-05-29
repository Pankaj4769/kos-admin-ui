import { Routes } from '@angular/router';
import { adminAuthGuard } from './core/auth/admin-auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: '',
    canActivate: [adminAuthGuard],
    loadComponent: () => import('./layout/main-layout.component').then(m => m.MainLayoutComponent),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'tenants',
        loadComponent: () => import('./features/tenants/tenants-list.component').then(m => m.TenantsListComponent)
      },
      {
        path: 'tenants/:id',
        loadComponent: () => import('./features/tenants/tenant-detail.component').then(m => m.TenantDetailComponent)
      },
      {
        path: 'change-password',
        loadComponent: () => import('./features/change-password/change-password.component').then(m => m.ChangePasswordComponent)
      },
      // Stubs: backend exists, UI is the next iteration.
      { path: 'users', loadComponent: () => import('./features/placeholder/placeholder.component').then(m => m.PlaceholderComponent), data: { title: 'Users', endpoint: 'GET /admin-api/users' } },
      { path: 'plans', loadComponent: () => import('./features/placeholder/placeholder.component').then(m => m.PlaceholderComponent), data: { title: 'Plans', endpoint: 'GET /admin-api/plans' } },
      { path: 'subscriptions', loadComponent: () => import('./features/placeholder/placeholder.component').then(m => m.PlaceholderComponent), data: { title: 'Subscriptions', endpoint: 'GET /admin-api/subscriptions' } },
      { path: 'employees', loadComponent: () => import('./features/placeholder/placeholder.component').then(m => m.PlaceholderComponent), data: { title: 'Employees', endpoint: 'GET /admin-api/employees' } },
      { path: 'leaves', loadComponent: () => import('./features/placeholder/placeholder.component').then(m => m.PlaceholderComponent), data: { title: 'Leaves', endpoint: 'GET /admin-api/leaves' } },
      { path: 'payroll', loadComponent: () => import('./features/placeholder/placeholder.component').then(m => m.PlaceholderComponent), data: { title: 'Payroll', endpoint: 'GET /admin-api/payroll/salary-slips' } },
      { path: 'audit', loadComponent: () => import('./features/placeholder/placeholder.component').then(m => m.PlaceholderComponent), data: { title: 'Audit log', endpoint: 'GET /admin-api/audit' } },
      { path: 'admin-users', loadComponent: () => import('./features/placeholder/placeholder.component').then(m => m.PlaceholderComponent), data: { title: 'Admin users', endpoint: 'GET /admin-api/admin-users' } }
    ]
  },
  { path: '**', redirectTo: '' }
];
