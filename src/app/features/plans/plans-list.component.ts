import { CurrencyPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { AdminAuthService } from '../../core/auth/admin-auth.service';
import {
  CreatePlanRequest,
  PlanResponse,
  UpdatePlanRequest
} from '../../core/models/plan';
import { PlanService } from '../../core/services/plan.service';
import { confirmAction } from '../../shared/confirm-dialog/confirm-dialog.component';
import { PlanEditDialogComponent } from './plan-edit-dialog.component';

@Component({
  selector: 'app-plans-list',
  imports: [
    CurrencyPipe,
    MatTableModule, MatButtonModule, MatIconModule,
    MatMenuModule, MatProgressSpinnerModule
  ],
  templateUrl: './plans-list.component.html',
  styleUrl: './plans-list.component.scss'
})
export class PlansListComponent {
  private readonly service = inject(PlanService);
  private readonly dialog = inject(MatDialog);
  private readonly auth = inject(AdminAuthService);

  readonly plans = signal<PlanResponse[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  readonly canEdit = computed(() => this.auth.user()?.role === 'SUPER_ADMIN');

  readonly displayedColumns = ['planName', 'description', 'price', 'durationDays', 'actions'];

  constructor() {
    this.fetch();
  }

  fetch() {
    this.loading.set(true);
    this.error.set(null);
    this.service.list().subscribe({
      next: p => { this.plans.set(p); this.loading.set(false); },
      error: e => { this.error.set(e?.error?.message ?? 'Failed to load'); this.loading.set(false); }
    });
  }

  openCreate() {
    const ref = this.dialog.open(PlanEditDialogComponent, { data: {} });
    ref.afterClosed().subscribe((req: CreatePlanRequest | undefined) => {
      if (!req) return;
      this.service.create(req as CreatePlanRequest).subscribe({
        next: () => this.fetch(),
        error: e => alert(e?.error?.message ?? 'Failed to create plan')
      });
    });
  }

  openEdit(plan: PlanResponse) {
    const ref = this.dialog.open(PlanEditDialogComponent, { data: { existing: plan } });
    ref.afterClosed().subscribe((req: UpdatePlanRequest | undefined) => {
      if (!req) return;
      this.service.update(plan.id, req).subscribe({
        next: () => this.fetch(),
        error: e => alert(e?.error?.message ?? 'Failed to update plan')
      });
    });
  }

  delete(plan: PlanResponse) {
    confirmAction(this.dialog, {
      title: 'Delete plan',
      message: `Delete plan ${plan.planName}? Any subscriptions on this plan will be orphaned.`,
      confirmText: 'Delete',
      variant: 'warn'
    }).subscribe(ok => {
      if (!ok) return;
      this.service.delete(plan.id).subscribe({
        next: () => this.fetch(),
        error: e => alert(e?.error?.message ?? 'Failed to delete plan')
      });
    });
  }
}
