import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { SubscriptionStatus } from '../models/admin-role';
import { Page } from '../models/page';
import {
  ExtendTrialRequest,
  OverridePlanRequest,
  SubscriptionResponse
} from '../models/subscription';
import { adminApi } from './api-base';

@Injectable({ providedIn: 'root' })
export class SubscriptionService {
  private readonly http = inject(HttpClient);

  list(opts: {
    page?: number;
    size?: number;
    status?: SubscriptionStatus;
  } = {}): Observable<Page<SubscriptionResponse>> {
    let params = new HttpParams()
      .set('page', String(opts.page ?? 0))
      .set('size', String(opts.size ?? 20));
    if (opts.status) params = params.set('status', opts.status);
    return this.http.get<Page<SubscriptionResponse>>(adminApi('/subscriptions'), { params });
  }

  byTenant(tenantId: string): Observable<SubscriptionResponse[]> {
    return this.http.get<SubscriptionResponse[]>(adminApi(`/subscriptions/by-tenant/${tenantId}`));
  }

  overridePlan(tenantId: string, req: OverridePlanRequest): Observable<SubscriptionResponse> {
    return this.http.post<SubscriptionResponse>(
      adminApi(`/subscriptions/${tenantId}/override-plan`), req);
  }

  extendTrial(tenantId: string, req: ExtendTrialRequest): Observable<SubscriptionResponse> {
    return this.http.post<SubscriptionResponse>(
      adminApi(`/subscriptions/${tenantId}/extend-trial`), req);
  }
}
