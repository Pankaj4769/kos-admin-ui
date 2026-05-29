import { CurrencyPipe, DatePipe, LowerCasePipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AdminAuthService } from '../../core/auth/admin-auth.service';
import { Tenant360 } from '../../core/models/tenant';
import { TenantService } from '../../core/services/tenant.service';

@Component({
  selector: 'app-suspend-dialog',
  imports: [
    ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule
  ],
  template: `
    <h2 mat-dialog-title>Suspend tenant</h2>
    <mat-dialog-content>
      <p>This will mark the tenant as suspended in the admin panel. The customer
        app does not yet enforce this — see the README's "soft marker" note.</p>
      <form [formGroup]="form">
        <mat-form-field appearance="outline" class="full">
          <mat-label>Reason</mat-label>
          <textarea matInput rows="3" formControlName="reason"
                    placeholder="e.g. payment failed 3x, fraud suspected, ..."></textarea>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="dialogRef.close()">Cancel</button>
      <button mat-flat-button color="warn"
              [disabled]="form.invalid"
              (click)="dialogRef.close(form.value.reason)">Suspend</button>
    </mat-dialog-actions>
  `,
  styles: [`.full { width: 100%; }`]
})
export class SuspendDialogComponent {
  private readonly fb = inject(FormBuilder);
  readonly dialogRef = inject(MatDialogRef<SuspendDialogComponent>);
  readonly form = this.fb.nonNullable.group({
    reason: ['', [Validators.required, Validators.maxLength(500)]]
  });
}

@Component({
  selector: 'app-tenant-detail',
  imports: [
    RouterLink, DatePipe, CurrencyPipe, LowerCasePipe,
    MatCardModule, MatButtonModule, MatIconModule, MatDividerModule,
    MatTableModule, MatProgressSpinnerModule, MatDialogModule
  ],
  templateUrl: './tenant-detail.component.html',
  styleUrl: './tenant-detail.component.scss'
})
export class TenantDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly service = inject(TenantService);
  private readonly dialog = inject(MatDialog);
  readonly auth = inject(AdminAuthService);

  readonly data = signal<Tenant360 | null>(null);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly userColumns = ['name', 'username', 'email', 'mobile', 'role'];

  readonly canSuspend = computed(() => this.auth.user()?.role === 'SUPER_ADMIN');

  private tenantId = '';

  ngOnInit() {
    this.tenantId = this.route.snapshot.paramMap.get('id') ?? '';
    this.refresh();
  }

  refresh() {
    this.loading.set(true);
    this.error.set(null);
    this.service.get360(this.tenantId).subscribe({
      next: d => { this.data.set(d); this.loading.set(false); },
      error: e => { this.error.set(e?.error?.message ?? 'Failed to load'); this.loading.set(false); }
    });
  }

  suspend() {
    const ref = this.dialog.open(SuspendDialogComponent, { width: '480px' });
    ref.afterClosed().subscribe((reason: string | undefined) => {
      if (!reason) return;
      this.service.suspend(this.tenantId, { reason }).subscribe({
        next: () => this.refresh(),
        error: e => alert(e?.error?.message ?? 'Failed to suspend')
      });
    });
  }

  reactivate() {
    if (!confirm('Reactivate this tenant?')) return;
    this.service.reactivate(this.tenantId).subscribe({
      next: () => this.refresh(),
      error: e => alert(e?.error?.message ?? 'Failed to reactivate')
    });
  }
}
