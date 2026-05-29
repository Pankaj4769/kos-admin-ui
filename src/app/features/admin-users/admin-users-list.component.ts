import { DatePipe, LowerCasePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AdminUserResponse } from '../../core/models/admin-user';
import { AdminUserService } from '../../core/services/admin-user.service';
import { confirmAction } from '../../shared/confirm-dialog/confirm-dialog.component';
import { CopyableComponent } from '../../shared/copyable.component';
import { AdminUserCreateDialogComponent } from './admin-user-create-dialog.component';

@Component({
  selector: 'app-admin-temp-password-dialog',
  imports: [MatDialogModule, MatButtonModule, MatIconModule, CopyableComponent],
  template: `
    <h2 mat-dialog-title>Temporary password</h2>
    <mat-dialog-content>
      <p>The admin must use this on next login and will be forced to set a new one.</p>
      <app-copyable [value]="password" />
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-flat-button color="primary" mat-dialog-close>Done</button>
    </mat-dialog-actions>
  `
})
export class AdminTempPasswordDialog {
  password = '';
}

@Component({
  selector: 'app-admin-users-list',
  imports: [
    DatePipe, LowerCasePipe, MatTableModule, MatButtonModule, MatIconModule,
    MatMenuModule, MatProgressSpinnerModule, MatTooltipModule
  ],
  templateUrl: './admin-users-list.component.html',
  styleUrl: './admin-users-list.component.scss'
})
export class AdminUsersListComponent {
  private readonly service = inject(AdminUserService);
  private readonly dialog = inject(MatDialog);

  readonly admins = signal<AdminUserResponse[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  readonly displayedColumns = ['name', 'email', 'role', 'enabled', 'mustReset', 'lastLoginAt', 'createdAt', 'actions'];

  constructor() {
    this.fetch();
  }

  fetch() {
    this.loading.set(true);
    this.error.set(null);
    this.service.list().subscribe({
      next: list => { this.admins.set(list); this.loading.set(false); },
      error: e => { this.error.set(e?.error?.message ?? 'Failed to load'); this.loading.set(false); }
    });
  }

  openInvite() {
    const ref = this.dialog.open(AdminUserCreateDialogComponent);
    ref.afterClosed().subscribe(req => {
      if (!req) return;
      this.service.create(req).subscribe({
        next: () => this.fetch(),
        error: e => alert(e?.error?.message ?? 'Failed to create')
      });
    });
  }

  toggleEnabled(u: AdminUserResponse) {
    const op = u.enabled ? this.service.disable(u.id) : this.service.enable(u.id);
    confirmAction(this.dialog, {
      title: u.enabled ? 'Disable admin' : 'Enable admin',
      message: u.enabled
        ? `Disable ${u.name}? They will be unable to log in until re-enabled.`
        : `Enable ${u.name}? They will regain login access.`,
      variant: u.enabled ? 'warn' : 'primary'
    }).subscribe(ok => {
      if (!ok) return;
      op.subscribe({
        next: () => this.fetch(),
        error: e => alert(e?.error?.message ?? 'Failed')
      });
    });
  }

  resetPassword(u: AdminUserResponse) {
    confirmAction(this.dialog, {
      title: 'Reset admin password',
      message: `Generate a new temporary password for ${u.name}? `
        + 'They will be forced to change it on next login.',
      variant: 'warn'
    }).subscribe(ok => {
      if (!ok) return;
      this.service.resetPassword(u.id).subscribe({
        next: res => {
          const ref = this.dialog.open(AdminTempPasswordDialog, { width: '420px' });
          ref.componentInstance.password = res.temporaryPassword;
          this.fetch();
        },
        error: e => alert(e?.error?.message ?? 'Failed')
      });
    });
  }

  delete(u: AdminUserResponse) {
    confirmAction(this.dialog, {
      title: 'Delete admin',
      message: `Permanently delete ${u.name} (${u.email})? This cannot be undone.`,
      confirmText: 'Delete',
      variant: 'warn'
    }).subscribe(ok => {
      if (!ok) return;
      this.service.delete(u.id).subscribe({
        next: () => this.fetch(),
        error: e => alert(e?.error?.message ?? 'Failed')
      });
    });
  }
}
