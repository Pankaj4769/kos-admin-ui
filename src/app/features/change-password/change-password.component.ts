import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { AdminAuthService } from '../../core/auth/admin-auth.service';

@Component({
  selector: 'app-change-password',
  imports: [
    ReactiveFormsModule,
    MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule
  ],
  template: `
    <div class="page" style="max-width: 480px;">
      <h1 class="page-title">Change password</h1>
      <mat-card>
        <mat-card-content>
          <form [formGroup]="form" (ngSubmit)="submit()" class="flex-col gap-2">
            <mat-form-field appearance="outline">
              <mat-label>Current password</mat-label>
              <input matInput type="password" formControlName="currentPassword" />
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>New password (min 12 chars)</mat-label>
              <input matInput type="password" formControlName="newPassword" />
              @if (form.controls.newPassword.touched && form.controls.newPassword.hasError('minlength')) {
                <mat-error>At least 12 characters.</mat-error>
              }
            </mat-form-field>
            @if (error()) { <div class="error">{{ error() }}</div> }
            @if (done()) { <div class="ok">Password updated.</div> }
            <button mat-flat-button color="primary"
                    [disabled]="form.invalid || loading()">Update password</button>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .error { background: #fee2e2; color: #991b1b; padding: 10px; border-radius: 8px; font-size: 13px; }
    .ok    { background: #dcfce7; color: #166534; padding: 10px; border-radius: 8px; font-size: 13px; }
  `]
})
export class ChangePasswordComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AdminAuthService);
  private readonly router = inject(Router);

  readonly form = this.fb.nonNullable.group({
    currentPassword: ['', Validators.required],
    newPassword: ['', [Validators.required, Validators.minLength(12)]]
  });

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly done = signal(false);

  submit() {
    if (this.form.invalid) return;
    this.loading.set(true);
    this.error.set(null);
    this.done.set(false);
    this.auth.changePassword(this.form.getRawValue()).subscribe({
      next: () => {
        this.done.set(true);
        this.loading.set(false);
        this.form.reset();
        setTimeout(() => this.router.navigate(['/dashboard']), 1500);
      },
      error: (err: HttpErrorResponse) => {
        this.loading.set(false);
        this.error.set(err.error?.message ?? 'Failed to update password');
      }
    });
  }
}
