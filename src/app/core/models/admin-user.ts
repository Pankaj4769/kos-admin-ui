import { AdminRole } from './admin-role';

export interface AdminUserResponse {
  id: number;
  name: string;
  email: string;
  role: AdminRole;
  enabled: boolean;
  mustResetPassword: boolean;
  lastLoginAt: string | null;
  createdAt: string;
}

export interface CreateAdminUserRequest {
  name: string;
  email: string;
  initialPassword: string;
  role: AdminRole;
}

export interface UpdateAdminUserRequest {
  name?: string;
  role?: AdminRole;
}

export interface ResetAdminPasswordResponse {
  temporaryPassword: string;
}
