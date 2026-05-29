export interface DashboardResponse {
  tenants: {
    total: number;
    active: number;
    suspended: number;
  };
  subscriptions: {
    active: number;
    trial: number;
    expired: number;
    cancelled: number;
  };
  revenue: {
    totalPaid: number;
    last30Days: number;
    mrr: number;
    arr: number;
  };
  activity: {
    signupsLast7Days: number;
    suspensionsLast7Days: number;
  };
}
