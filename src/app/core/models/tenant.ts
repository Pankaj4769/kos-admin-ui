import { TenantStatus } from './admin-role';
import { UserSummary } from './user';

export interface TenantSummary {
  id: string;
  name: string;
  ownerEmail: string | null;
  plan: string | null;
  planStatus: string | null;
  status: TenantStatus;
  suspendedAt: string | null;
}

export interface TenantDetail {
  id: string;
  name: string;
  ownerEmail: string | null;
  ownerName: string | null;
  ownerMobile: string | null;
  plan: string | null;
  planStatus: string | null;
  planStartDate: string | null;
  planExpiryDate: string | null;
  status: TenantStatus;
  suspendedAt: string | null;
  suspensionReason: string | null;
  suspendedByAdminEmail: string | null;
}

export interface SuspendTenantRequest {
  reason: string;
}

export interface Tenant360 {
  tenant: TenantDetail;
  stats: {
    totalOrders: number;
    paidOrders: number;
    revenueLast30Days: number;
    employeeCount: number;
    activeEmployeeCount: number;
    pendingLeavesCount: number;
  };
  users: UserSummary[];
}
