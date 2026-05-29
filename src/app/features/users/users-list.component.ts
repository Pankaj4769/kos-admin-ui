import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { debounceTime } from 'rxjs';
import { UserRole } from '../../core/models/admin-role';
import { Page } from '../../core/models/page';
import { ResetUserPasswordResponse, UserSummary } from '../../core/models/user';
import { UserService } from '../../core/services/user.service';
import { confirmAction } from '../../shared/confirm-dialog/confirm-dialog.component';
import { CopyableComponent } from '../../shared/copyable.component';

@Component({
  selector: 'app-user-reset-password-dialog',
  imports: [MatDialogModule, MatButtonModule, MatIconModule, CopyableComponent],
  template: `
    <h2 mat-dialog-title>Temporary password</h2>
    <mat-dialog-content>
      <p>Share this with the user (in person or via secure channel).
        They will be forced to change it on next login.</p>
      <div class="copy-box">
        <app-copyable [value]="data.temporaryPassword" />
      </div>
      @if (data.warning) {
        <p class="warning"><mat-icon>info</mat-icon> {{ data.warning }}</p>
      }
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-flat-button color="primary" mat-dialog-close>Done</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .copy-box { margin: 16px 0; }
    .warning {
      display: flex; align-items: flex-start; gap: 6px;
      color: #92400e; font-size: 13px;
      background: #fef3c7; padding: 10px; border-radius: 6px;
    }
    mat-icon { font-size: 18px; width: 18px; height: 18px; margin-top: 2px; }
  `]
})
export class UserResetPasswordDialog {
  readonly data = inject<ResetUserPasswordResponse>(MAT_DIALOG_DATA);
}

@Component({
  selector: 'app-users-list',
  imports: [
    ReactiveFormsModule, RouterLink,
    MatTableModule, MatPaginatorModule, MatFormFieldModule,
    MatInputModule, MatSelectModule, MatIconModule, MatButtonModule,
    MatMenuModule, MatProgressSpinnerModule
  ],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.scss'
})
export class UsersListComponent {
  private readonly fb = inject(FormBuilder);
  private readonly service = inject(UserService);
  private readonly dialog = inject(MatDialog);

  readonly filters = this.fb.nonNullable.group({
    search: [''],
    role: [null as UserRole | null],
    tenantId: ['']
  });

  readonly displayedColumns = ['name', 'username', 'email', 'mobile', 'role', 'tenantId', 'mustReset', 'actions'];
  readonly roles: UserRole[] = ['OWNER', 'MANAGER', 'CHEF', 'WAITER', 'CASHIER', 'BILLING_ASSISTANT', 'ADMIN'];

  readonly page = signal<Page<UserSummary> | null>(null);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  private currentPage = 0;
  private currentSize = 20;

  constructor() {
    this.fetch();
    this.filters.valueChanges.pipe(debounceTime(300)).subscribe(() => {
      this.currentPage = 0;
      this.fetch();
    });
  }

  fetch() {
    this.loading.set(true);
    this.error.set(null);
    const v = this.filters.getRawValue();
    this.service.list({
      page: this.currentPage,
      size: this.currentSize,
      search: v.search?.trim() || undefined,
      role: v.role ?? undefined,
      tenantId: v.tenantId?.trim() || undefined
    }).subscribe({
      next: p => { this.page.set(p); this.loading.set(false); },
      error: e => { this.error.set(e?.error?.message ?? 'Failed to load'); this.loading.set(false); }
    });
  }

  onPageChange(e: PageEvent) {
    this.currentPage = e.pageIndex;
    this.currentSize = e.pageSize;
    this.fetch();
  }

  resetPassword(user: UserSummary) {
    confirmAction(this.dialog, {
      title: 'Reset password',
      message: `Generate a temporary password for ${user.name} (${user.email ?? user.username})? `
        + 'They will be forced to change it on next login.',
      confirmText: 'Reset',
      variant: 'warn'
    }).subscribe(ok => {
      if (!ok) return;
      this.service.resetPassword(user.id).subscribe({
        next: res => {
          this.dialog.open(UserResetPasswordDialog, { width: '480px', data: res });
          this.fetch();
        },
        error: e => alert(e?.error?.message ?? 'Failed to reset password')
      });
    });
  }

  clearFilters() {
    this.filters.reset({ search: '', role: null, tenantId: '' });
  }
}
