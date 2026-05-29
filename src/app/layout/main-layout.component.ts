import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AdminAuthService } from '../core/auth/admin-auth.service';

interface NavItem {
  label: string;
  icon: string;
  route: string;
  superAdminOnly?: boolean;
}

@Component({
  selector: 'app-main-layout',
  imports: [
    RouterOutlet, RouterLink, RouterLinkActive,
    MatSidenavModule, MatToolbarModule, MatListModule,
    MatIconModule, MatButtonModule, MatMenuModule
  ],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss'
})
export class MainLayoutComponent {
  readonly auth = inject(AdminAuthService);
  private readonly router = inject(Router);

  readonly nav: NavItem[] = [
    { label: 'Dashboard', icon: 'dashboard', route: '/dashboard' },
    { label: 'Tenants', icon: 'storefront', route: '/tenants' },
    { label: 'Users', icon: 'people', route: '/users' },
    { label: 'Plans', icon: 'card_membership', route: '/plans' },
    { label: 'Subscriptions', icon: 'subscriptions', route: '/subscriptions' },
    { label: 'Employees', icon: 'badge', route: '/employees' },
    { label: 'Leaves', icon: 'event_busy', route: '/leaves' },
    { label: 'Payroll', icon: 'payments', route: '/payroll' },
    { label: 'Audit log', icon: 'history', route: '/audit' },
    { label: 'Admin users', icon: 'admin_panel_settings', route: '/admin-users', superAdminOnly: true }
  ];

  visibleNav(): NavItem[] {
    const isSuper = this.auth.user()?.role === 'SUPER_ADMIN';
    return this.nav.filter(n => !n.superAdminOnly || isSuper);
  }

  logout() {
    this.auth.logout();
  }

  changePassword() {
    this.router.navigate(['/change-password']);
  }
}
