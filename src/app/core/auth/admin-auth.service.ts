import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  AdminUserSummary,
  ChangePasswordRequest,
  LoginRequest,
  LoginResponse,
  RefreshRequest
} from '../models/auth';

const TOKEN_KEY = 'kos_admin_access_token';
const REFRESH_KEY = 'kos_admin_refresh_token';
const USER_KEY = 'kos_admin_user';

@Injectable({ providedIn: 'root' })
export class AdminAuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly base = `${environment.apiBaseUrl}/admin-api/auth`;

  // Reactive signals so guards/components react to login/logout without subscriptions.
  private readonly _user = signal<AdminUserSummary | null>(this.readStoredUser());
  readonly user = this._user.asReadonly();
  readonly isLoggedIn = computed(() => this._user() !== null);

  login(req: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.base}/login`, req).pipe(
      tap(res => this.applyLogin(res))
    );
  }

  refresh(): Observable<LoginResponse> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
    const body: RefreshRequest = { refreshToken };
    return this.http.post<LoginResponse>(`${this.base}/refresh`, body).pipe(
      tap(res => this.applyLogin(res))
    );
  }

  changePassword(req: ChangePasswordRequest): Observable<void> {
    return this.http.post<void>(`${this.base}/change-password`, req);
  }

  me(): Observable<AdminUserSummary> {
    return this.http.get<AdminUserSummary>(`${this.base}/me`).pipe(
      tap(user => {
        this._user.set(user);
        sessionStorage.setItem(USER_KEY, JSON.stringify(user));
      })
    );
  }

  logout(): void {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(REFRESH_KEY);
    sessionStorage.removeItem(USER_KEY);
    this._user.set(null);
    this.router.navigate(['/login']);
  }

  getAccessToken(): string | null {
    return sessionStorage.getItem(TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return sessionStorage.getItem(REFRESH_KEY);
  }

  // ---------- internal ----------

  private applyLogin(res: LoginResponse): void {
    sessionStorage.setItem(TOKEN_KEY, res.accessToken);
    sessionStorage.setItem(REFRESH_KEY, res.refreshToken);
    sessionStorage.setItem(USER_KEY, JSON.stringify(res.user));
    this._user.set(res.user);
  }

  private readStoredUser(): AdminUserSummary | null {
    const raw = sessionStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as AdminUserSummary;
    } catch {
      return null;
    }
  }
}
