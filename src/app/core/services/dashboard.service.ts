import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { DashboardResponse } from '../models/dashboard';
import { adminApi } from './api-base';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly http = inject(HttpClient);

  overview(): Observable<DashboardResponse> {
    return this.http.get<DashboardResponse>(adminApi('/dashboard'));
  }
}
