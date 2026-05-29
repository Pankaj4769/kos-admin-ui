import { PlanType } from './admin-role';

export interface SubscriptionResponse {
  id: number;
  tenantId: string;
  plan: string | null;
  status: string | null;
  startDate: string | null;
  expiryDate: string | null;
  trialEndDate: string | null;
}

export interface OverridePlanRequest {
  newPlanName: PlanType;
}

export interface ExtendTrialRequest {
  additionalDays: number;
}
