import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { EmployeeStatus } from '../models/admin-role';
import { EmployeeSummary } from '../models/employee';
import { Page } from '../models/page';
import { adminApi } from './api-base';

@Injectable({ providedIn: 'root' })
export class EmployeeService {
  private readonly http = inject(HttpClient);

  list(opts: {
    page?: number;
    size?: number;
    status?: EmployeeStatus;
    tenantId?: string;
  } = {}): Observable<Page<EmployeeSummary>> {
    let params = new HttpParams()
      .set('page', String(opts.page ?? 0))
      .set('size', String(opts.size ?? 20));
    if (opts.status) params = params.set('status', opts.status);
    if (opts.tenantId) params = params.set('tenantId', opts.tenantId);
    return this.http.get<Page<EmployeeSummary>>(adminApi('/employees'), { params });
  }

  get(id: number): Observable<EmployeeSummary> {
    return this.http.get<EmployeeSummary>(adminApi(`/employees/${id}`));
  }
}
