import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DashboardService } from '../../core/services/dashboard.service';
import { DashboardResponse } from '../../core/models/dashboard';

@Component({
  selector: 'app-dashboard',
  imports: [MatCardModule, MatIconModule, MatProgressSpinnerModule, CurrencyPipe, DecimalPipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  private readonly service = inject(DashboardService);

  readonly data = signal<DashboardResponse | null>(null);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  constructor() {
    this.refresh();
  }

  refresh() {
    this.loading.set(true);
    this.error.set(null);
    this.service.overview().subscribe({
      next: d => { this.data.set(d); this.loading.set(false); },
      error: e => { this.error.set(e?.error?.message ?? 'Failed to load'); this.loading.set(false); }
    });
  }
}
