import { DatePipe, LowerCasePipe } from '@angular/common';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { debounceTime } from 'rxjs';
import { AuditLogResponse } from '../../core/models/audit';
import { Page } from '../../core/models/page';
import { AuditService } from '../../core/services/audit.service';

@Component({
  selector: 'app-audit-list',
  imports: [
    ReactiveFormsModule, DatePipe, LowerCasePipe,
    MatTableModule, MatPaginatorModule, MatFormFieldModule,
    MatInputModule, MatDatepickerModule, MatNativeDateModule,
    MatIconModule, MatButtonModule, MatProgressSpinnerModule, MatTooltipModule
  ],
  templateUrl: './audit-list.component.html',
  styleUrl: './audit-list.component.scss',
  animations: [
    trigger('detailExpand', [
      state('collapsed,void', style({ height: '0px', minHeight: '0', display: 'none' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('180ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
    ])
  ]
})
export class AuditListComponent {
  private readonly fb = inject(FormBuilder);
  private readonly service = inject(AuditService);

  readonly filters = this.fb.nonNullable.group({
    actor: [''],
    action: [''],
    targetType: [''],
    from: [null as Date | null],
    to: [null as Date | null]
  });

  readonly displayedColumns = ['createdAt', 'actor', 'action', 'method', 'path', 'outcome', 'expand'];

  readonly page = signal<Page<AuditLogResponse> | null>(null);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly expanded = signal<number | null>(null);

  private currentPage = 0;
  private currentSize = 50;

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
      actor: v.actor?.trim() || undefined,
      action: v.action?.trim() || undefined,
      targetType: v.targetType?.trim() || undefined,
      from: v.from ? v.from.toISOString() : undefined,
      to: v.to ? v.to.toISOString() : undefined
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

  toggleExpand(id: number) {
    this.expanded.set(this.expanded() === id ? null : id);
  }

  clearFilters() {
    this.filters.reset({ actor: '', action: '', targetType: '', from: null, to: null });
  }

  /** Pretty-print JSON snapshots (truncated to 4KB on the server). */
  prettyJson(raw: string | null): string {
    if (!raw) return '';
    try {
      return JSON.stringify(JSON.parse(raw), null, 2);
    } catch {
      return raw;
    }
  }
}
