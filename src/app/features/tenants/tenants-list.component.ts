import { DatePipe, LowerCasePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { debounceTime } from 'rxjs';
import { Page } from '../../core/models/page';
import { TenantSummary } from '../../core/models/tenant';
import { TenantService } from '../../core/services/tenant.service';

@Component({
  selector: 'app-tenants-list',
  imports: [
    ReactiveFormsModule, RouterLink, DatePipe, LowerCasePipe,
    MatTableModule, MatPaginatorModule, MatChipsModule,
    MatFormFieldModule, MatInputModule, MatIconModule,
    MatButtonModule, MatProgressSpinnerModule
  ],
  templateUrl: './tenants-list.component.html',
  styleUrl: './tenants-list.component.scss'
})
export class TenantsListComponent {
  private readonly service = inject(TenantService);

  readonly searchControl = new FormControl('', { nonNullable: true });
  readonly displayedColumns = ['id', 'name', 'ownerEmail', 'plan', 'planStatus', 'status', 'suspendedAt'];

  readonly page = signal<Page<TenantSummary> | null>(null);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  private currentPage = 0;
  private currentSize = 20;

  constructor() {
    this.fetch();
    this.searchControl.valueChanges
      .pipe(debounceTime(300))
      .subscribe(() => {
        this.currentPage = 0;
        this.fetch();
      });
  }

  fetch() {
    this.loading.set(true);
    this.error.set(null);
    const search = this.searchControl.value?.trim() || undefined;
    this.service.list({ page: this.currentPage, size: this.currentSize, search }).subscribe({
      next: p => { this.page.set(p); this.loading.set(false); },
      error: e => { this.error.set(e?.error?.message ?? 'Failed to load'); this.loading.set(false); }
    });
  }

  onPageChange(e: PageEvent) {
    this.currentPage = e.pageIndex;
    this.currentSize = e.pageSize;
    this.fetch();
  }
}
