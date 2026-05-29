import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { RevenueByTenantPoint, RevenuePoint, SignupPoint } from '../models/analytics';
import { adminApi } from './api-base';

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private readonly http = inject(HttpClient);

  revenue(from?: string, to?: string): Observable<RevenuePoint[]> {
    let params = new HttpParams();
    if (from) params = params.set('from', from);
    if (to) params = params.set('to', to);
    return this.http.get<RevenuePoint[]>(adminApi('/analytics/revenue'), { params });
  }

  revenueByTenant(from?: string, to?: string): Observable<RevenueByTenantPoint[]> {
    let params = new HttpParams();
    if (from) params = params.set('from', from);
    if (to) params = params.set('to', to);
    return this.http.get<RevenueByTenantPoint[]>(adminApi('/analytics/revenue/by-tenant'), { params });
  }

  signups(from?: string, to?: string): Observable<SignupPoint[]> {
    let params = new HttpParams();
    if (from) params = params.set('from', from);
    if (to) params = params.set('to', to);
    return this.http.get<SignupPoint[]>(adminApi('/analytics/signups'), { params });
  }
}
