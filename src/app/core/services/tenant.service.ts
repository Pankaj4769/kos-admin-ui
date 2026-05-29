import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Page } from '../models/page';
import { SuspendTenantRequest, Tenant360, TenantDetail, TenantSummary } from '../models/tenant';
import { adminApi } from './api-base';

@Injectable({ providedIn: 'root' })
export class TenantService {
  private readonly http = inject(HttpClient);

  list(opts: { page?: number; size?: number; search?: string } = {}): Observable<Page<TenantSummary>> {
    let params = new HttpParams()
      .set('page', String(opts.page ?? 0))
      .set('size', String(opts.size ?? 20));
    if (opts.search) params = params.set('search', opts.search);
    return this.http.get<Page<TenantSummary>>(adminApi('/tenants'), { params });
  }

  get(id: string): Observable<TenantDetail> {
    return this.http.get<TenantDetail>(adminApi(`/tenants/${id}`));
  }

  get360(id: string): Observable<Tenant360> {
    return this.http.get<Tenant360>(adminApi(`/tenants/${id}/360`));
  }

  suspend(id: string, req: SuspendTenantRequest): Observable<TenantDetail> {
    return this.http.patch<TenantDetail>(adminApi(`/tenants/${id}/suspend`), req);
  }

  reactivate(id: string): Observable<TenantDetail> {
    return this.http.patch<TenantDetail>(adminApi(`/tenants/${id}/reactivate`), {});
  }
}
