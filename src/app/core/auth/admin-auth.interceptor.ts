import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AdminAuthService } from './admin-auth.service';

/**
 * Attaches the Bearer token (when present) and forces logout + redirect
 * on a 401 from any /admin-api/** endpoint OTHER than the login/refresh
 * endpoints themselves (where 401 is just "wrong credentials").
 */
export const adminAuthInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AdminAuthService);

  let outgoing = req;
  if (req.url.includes('/admin-api/')) {
    const token = auth.getAccessToken();
    if (token) {
      outgoing = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      });
    }
  }

  return next(outgoing).pipe(
    catchError((err: unknown) => {
      if (err instanceof HttpErrorResponse && err.status === 401) {
        const isAuthEndpoint =
          req.url.includes('/admin-api/auth/login') ||
          req.url.includes('/admin-api/auth/refresh');
        if (!isAuthEndpoint) {
          auth.logout();
        }
      }
      return throwError(() => err);
    })
  );
};
