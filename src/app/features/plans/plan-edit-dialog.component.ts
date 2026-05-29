import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { PlanType } from '../../core/models/admin-role';
import { CreatePlanRequest, PlanResponse, UpdatePlanRequest } from '../../core/models/plan';

export interface PlanEditDialogData {
  /** undefined = create; defined = edit (planName is read-only). */
  existing?: PlanResponse;
}

@Component({
  selector: 'app-plan-edit-dialog',
  imports: [
    ReactiveFormsModule, MatDialogModule, MatButtonModule,
    MatFormFieldModule, MatInputModule, MatSelectModule
  ],
  template: `
    <h2 mat-dialog-title>{{ data.existing ? 'Edit plan' : 'Create plan' }}</h2>
    <mat-dialog-content>
      <form [formGroup]="form" class="form">
        <mat-form-field appearance="outline">
          <mat-label>Plan name</mat-label>
          <mat-select formControlName="planName">
            @for (p of planTypes; track p) {
              <mat-option [value]="p">{{ p }}</mat-option>
            }
          </mat-select>
          @if (data.existing) {
            <mat-hint>Plan name cannot be changed after creation.</mat-hint>
          }
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Description</mat-label>
          <textarea matInput rows="2" formControlName="description"></textarea>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Price (INR)</mat-label>
          <input matInput type="number" min="0" step="100" formControlName="price" />
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Duration (days)</mat-label>
          <input matInput type="number" min="1" formControlName="durationDays" />
        </mat-form-field>
      </form>
      @if (error()) { <div class="error">{{ error() }}</div> }
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="ref.close()">Cancel</button>
      <button mat-flat-button color="primary"
              [disabled]="form.invalid"
              (click)="submit()">
        {{ data.existing ? 'Save' : 'Create' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .form { display: flex; flex-direction: column; gap: 4px; min-width: 360px; }
    .form mat-form-field { width: 100%; }
    .error { background: #fee2e2; color: #991b1b; padding: 8px 12px; border-radius: 6px; font-size: 13px; }
  `]
})
export class PlanEditDialogComponent {
  private readonly fb = inject(FormBuilder);
  readonly ref = inject(MatDialogRef<PlanEditDialogComponent, CreatePlanRequest | UpdatePlanRequest>);
  readonly data = inject<PlanEditDialogData>(MAT_DIALOG_DATA);

  readonly planTypes: PlanType[] = ['STARTER', 'GROWTH', 'PRO', 'ENTERPRISE'];
  readonly error = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    planName: [{ value: this.data.existing?.planName as PlanType ?? 'STARTER',
                 disabled: !!this.data.existing }, Validators.required],
    description: [this.data.existing?.description ?? ''],
    price: [this.data.existing?.price ?? 0, [Validators.required, Validators.min(0)]],
    durationDays: [this.data.existing?.durationDays ?? 30, [Validators.required, Validators.min(1)]]
  });

  submit() {
    const v = this.form.getRawValue();
    if (this.data.existing) {
      const upd: UpdatePlanRequest = {
        description: v.description || undefined,
        price: v.price,
        durationDays: v.durationDays
      };
      this.ref.close(upd);
    } else {
      const create: CreatePlanRequest = {
        planName: v.planName,
        description: v.description || undefined,
        price: v.price,
        durationDays: v.durationDays
      };
      this.ref.close(create);
    }
  }
}
