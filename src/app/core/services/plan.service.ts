import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { CreatePlanRequest, PlanResponse, UpdatePlanRequest } from '../models/plan';
import { adminApi } from './api-base';

@Injectable({ providedIn: 'root' })
export class PlanService {
  private readonly http = inject(HttpClient);

  list(): Observable<PlanResponse[]> {
    return this.http.get<PlanResponse[]>(adminApi('/plans'));
  }

  get(id: number): Observable<PlanResponse> {
    return this.http.get<PlanResponse>(adminApi(`/plans/${id}`));
  }

  create(req: CreatePlanRequest): Observable<PlanResponse> {
    return this.http.post<PlanResponse>(adminApi('/plans'), req);
  }

  update(id: number, req: UpdatePlanRequest): Observable<PlanResponse> {
    return this.http.put<PlanResponse>(adminApi(`/plans/${id}`), req);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(adminApi(`/plans/${id}`));
  }
}
