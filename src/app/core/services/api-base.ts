import { environment } from '../../../environments/environment';

/** Build a fully-qualified URL relative to /admin-api. */
export const adminApi = (path: string): string =>
  `${environment.apiBaseUrl}/admin-api${path.startsWith('/') ? path : '/' + path}`;
