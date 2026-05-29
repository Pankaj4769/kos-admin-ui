import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { AdminRole } from '../../core/models/admin-role';
import { CreateAdminUserRequest } from '../../core/models/admin-user';

@Component({
  selector: 'app-admin-user-create-dialog',
  imports: [
    ReactiveFormsModule, MatDialogModule, MatButtonModule,
    MatFormFieldModule, MatInputModule, MatSelectModule
  ],
  template: `
    <h2 mat-dialog-title>Invite admin user</h2>
    <mat-dialog-content>
      <p class="hint">The new admin will be flagged <code>mustResetPassword</code>
        and forced to change the initial password on first login.</p>
      <form [formGroup]="form" class="form">
        <mat-form-field appearance="outline">
          <mat-label>Full name</mat-label>
          <input matInput formControlName="name" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Email</mat-label>
          <input matInput type="email" formControlName="email" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Initial password (min 12 chars)</mat-label>
          <input matInput formControlName="initialPassword" />
          <mat-hint>Share securely; user must rotate on first login.</mat-hint>
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Role</mat-label>
          <mat-select formControlName="role">
            @for (r of roles; track r) {
              <mat-option [value]="r">{{ r }}</mat-option>
            }
          </mat-select>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="ref.close()">Cancel</button>
      <button mat-flat-button color="primary"
              [disabled]="form.invalid"
              (click)="submit()">Create</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .form { display: flex; flex-direction: column; gap: 4px; min-width: 380px; }
    .form mat-form-field { width: 100%; }
    .hint { color: #6b7280; font-size: 13px; margin: 0 0 12px; }
    code { background: #f3f4f6; padding: 1px 5px; border-radius: 3px; font-size: 12px; }
  `]
})
export class AdminUserCreateDialogComponent {
  private readonly fb = inject(FormBuilder);
  readonly ref = inject(MatDialogRef<AdminUserCreateDialogComponent, CreateAdminUserRequest>);

  readonly roles: AdminRole[] = ['SUPER_ADMIN', 'SUPPORT_ADMIN', 'READ_ONLY_ADMIN'];

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(120)]],
    email: ['', [Validators.required, Validators.email]],
    initialPassword: ['', [Validators.required, Validators.minLength(12)]],
    role: ['SUPPORT_ADMIN' as AdminRole, Validators.required]
  });

  submit() {
    this.ref.close(this.form.getRawValue());
  }
}
