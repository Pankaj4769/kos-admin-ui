import { UserRole } from './admin-role';

export interface UserSummary {
  id: number;
  name: string;
  username: string;
  email: string | null;
  mobile: string | null;
  role: UserRole;
  tenantId: string | null;
  mustResetPassword: boolean;
}

export interface ResetUserPasswordResponse {
  userId: number;
  temporaryPassword: string;
  warning: string;
}
