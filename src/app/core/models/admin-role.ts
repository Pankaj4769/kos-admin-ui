export type AdminRole = 'SUPER_ADMIN' | 'SUPPORT_ADMIN' | 'READ_ONLY_ADMIN';

export type UserRole =
  | 'OWNER'
  | 'MANAGER'
  | 'CHEF'
  | 'WAITER'
  | 'CASHIER'
  | 'BILLING_ASSISTANT'
  | 'ADMIN';

export type TenantStatus = 'ACTIVE' | 'SUSPENDED';

export type SubscriptionStatus = 'ACTIVE' | 'EXPIRED' | 'CANCELLED' | 'TRIAL';

export type PlanType = 'STARTER' | 'GROWTH' | 'PRO' | 'ENTERPRISE';

export type EmployeeStatus = 'ACTIVE' | 'INACTIVE' | 'ON_LEAVE' | 'TERMINATED';

export type LeaveType = 'SICK' | 'CASUAL' | 'EARNED' | 'UNPAID';
export type LeaveStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export type PayrollStatus = 'GENERATED' | 'SENT' | 'PAID' | 'HOLD';
