import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AuditLogResponse } from '../models/audit';
import { Page } from '../models/page';
import { adminApi } from './api-base';

@Injectable({ providedIn: 'root' })
export class AuditService {
  private readonly http = inject(HttpClient);

  list(opts: {
    page?: number;
    size?: number;
    actor?: string;
    action?: string;
    targetType?: string;
    from?: string;
    to?: string;
  } = {}): Observable<Page<AuditLogResponse>> {
    let params = new HttpParams()
      .set('page', String(opts.page ?? 0))
      .set('size', String(opts.size ?? 50));
    if (opts.actor) params = params.set('actor', opts.actor);
    if (opts.action) params = params.set('action', opts.action);
    if (opts.targetType) params = params.set('targetType', opts.targetType);
    if (opts.from) params = params.set('from', opts.from);
    if (opts.to) params = params.set('to', opts.to);
    return this.http.get<Page<AuditLogResponse>>(adminApi('/audit'), { params });
  }

  get(id: number): Observable<AuditLogResponse> {
    return this.http.get<AuditLogResponse>(adminApi(`/audit/${id}`));
  }
}
