import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { UserRole } from '../models/admin-role';
import { Page } from '../models/page';
import { ResetUserPasswordResponse, UserSummary } from '../models/user';
import { adminApi } from './api-base';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly http = inject(HttpClient);

  list(opts: {
    page?: number;
    size?: number;
    tenantId?: string;
    role?: UserRole;
    search?: string;
  } = {}): Observable<Page<UserSummary>> {
    let params = new HttpParams()
      .set('page', String(opts.page ?? 0))
      .set('size', String(opts.size ?? 20));
    if (opts.tenantId) params = params.set('tenantId', opts.tenantId);
    if (opts.role) params = params.set('role', opts.role);
    if (opts.search) params = params.set('search', opts.search);
    return this.http.get<Page<UserSummary>>(adminApi('/users'), { params });
  }

  get(id: number): Observable<UserSummary> {
    return this.http.get<UserSummary>(adminApi(`/users/${id}`));
  }

  resetPassword(id: number): Observable<ResetUserPasswordResponse> {
    return this.http.patch<ResetUserPasswordResponse>(adminApi(`/users/${id}/reset-password`), {});
  }
}
