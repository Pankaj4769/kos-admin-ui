import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import {
  AdminUserResponse,
  CreateAdminUserRequest,
  ResetAdminPasswordResponse,
  UpdateAdminUserRequest
} from '../models/admin-user';
import { adminApi } from './api-base';

@Injectable({ providedIn: 'root' })
export class AdminUserService {
  private readonly http = inject(HttpClient);

  list(): Observable<AdminUserResponse[]> {
    return this.http.get<AdminUserResponse[]>(adminApi('/admin-users'));
  }

  get(id: number): Observable<AdminUserResponse> {
    return this.http.get<AdminUserResponse>(adminApi(`/admin-users/${id}`));
  }

  create(req: CreateAdminUserRequest): Observable<AdminUserResponse> {
    return this.http.post<AdminUserResponse>(adminApi('/admin-users'), req);
  }

  update(id: number, req: UpdateAdminUserRequest): Observable<AdminUserResponse> {
    return this.http.patch<AdminUserResponse>(adminApi(`/admin-users/${id}`), req);
  }

  enable(id: number): Observable<AdminUserResponse> {
    return this.http.patch<AdminUserResponse>(adminApi(`/admin-users/${id}/enable`), {});
  }

  disable(id: number): Observable<AdminUserResponse> {
    return this.http.patch<AdminUserResponse>(adminApi(`/admin-users/${id}/disable`), {});
  }

  resetPassword(id: number): Observable<ResetAdminPasswordResponse> {
    return this.http.patch<ResetAdminPasswordResponse>(adminApi(`/admin-users/${id}/reset-password`), {});
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(adminApi(`/admin-users/${id}`));
  }
}
