import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Page } from '../models/page';
import { PayrollSummary, SalarySlipSummary } from '../models/payroll';
import { adminApi } from './api-base';

@Injectable({ providedIn: 'root' })
export class PayrollService {
  private readonly http = inject(HttpClient);

  salarySlips(opts: {
    page?: number;
    size?: number;
    month?: string;
    tenantId?: string;
  } = {}): Observable<Page<SalarySlipSummary>> {
    let params = new HttpParams()
      .set('page', String(opts.page ?? 0))
      .set('size', String(opts.size ?? 20));
    if (opts.month) params = params.set('month', opts.month);
    if (opts.tenantId) params = params.set('tenantId', opts.tenantId);
    return this.http.get<Page<SalarySlipSummary>>(adminApi('/payroll/salary-slips'), { params });
  }

  summary(month: string): Observable<PayrollSummary> {
    const params = new HttpParams().set('month', month);
    return this.http.get<PayrollSummary>(adminApi('/payroll/summary'), { params });
  }
}
