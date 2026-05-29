import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { LeaveStatus } from '../models/admin-role';
import { LeaveSummary } from '../models/leave';
import { Page } from '../models/page';
import { adminApi } from './api-base';

@Injectable({ providedIn: 'root' })
export class LeaveService {
  private readonly http = inject(HttpClient);

  list(opts: {
    page?: number;
    size?: number;
    status?: LeaveStatus;
    tenantId?: string;
  } = {}): Observable<Page<LeaveSummary>> {
    let params = new HttpParams()
      .set('page', String(opts.page ?? 0))
      .set('size', String(opts.size ?? 20));
    if (opts.status) params = params.set('status', opts.status);
    if (opts.tenantId) params = params.set('tenantId', opts.tenantId);
    return this.http.get<Page<LeaveSummary>>(adminApi('/leaves'), { params });
  }
}
