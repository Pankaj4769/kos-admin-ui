import { AdminRole } from './admin-role';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RefreshRequest {
  refreshToken: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface AdminUserSummary {
  id: number | null;
  name: string | null;
  email: string;
  role: AdminRole | null;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresInSeconds: number;
  user: AdminUserSummary;
}
