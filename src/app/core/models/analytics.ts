export interface RevenuePoint {
  date: string;
  revenue: number;
}

export interface RevenueByTenantPoint {
  tenantId: string;
  revenue: number;
  orderCount: number;
}

export interface SignupPoint {
  date: string;
  count: number;
}
