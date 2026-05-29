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
      {
        path: 'users',
        loadComponent: () => import('./features/users/users-list.component').then(m => m.UsersListComponent)
      },
      {
        path: 'plans',
        loadComponent: () => import('./features/plans/plans-list.component').then(m => m.PlansListComponent)
      },
      {
        path: 'admin-users',
        loadComponent: () => import('./features/admin-users/admin-users-list.component').then(m => m.AdminUsersListComponent)
      },
      {
        path: 'audit',
        loadComponent: () => import('./features/audit/audit-list.component').then(m => m.AuditListComponent)
      },
      // Remaining stubs: backend is ready, UI will land in a future iteration.
      { path: 'subscriptions', loadComponent: () => import('./features/placeholder/placeholder.component').then(m => m.PlaceholderComponent), data: { title: 'Subscriptions', endpoint: 'GET /admin-api/subscriptions' } },
      { path: 'employees', loadComponent: () => import('./features/placeholder/placeholder.component').then(m => m.PlaceholderComponent), data: { title: 'Employees', endpoint: 'GET /admin-api/employees' } },
      { path: 'leaves', loadComponent: () => import('./features/placeholder/placeholder.component').then(m => m.PlaceholderComponent), data: { title: 'Leaves', endpoint: 'GET /admin-api/leaves' } },
      { path: 'payroll', loadComponent: () => import('./features/placeholder/placeholder.component').then(m => m.PlaceholderComponent), data: { title: 'Payroll', endpoint: 'GET /admin-api/payroll/salary-slips' } }
    ]
  },
  { path: '**', redirectTo: '' }
];
