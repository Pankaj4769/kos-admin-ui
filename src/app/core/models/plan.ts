import { PlanType } from './admin-role';

export interface PlanResponse {
  id: number;
  planName: string;
  description: string | null;
  price: number;
  durationDays: number;
}

export interface CreatePlanRequest {
  planName: PlanType;
  description?: string;
  price: number;
  durationDays: number;
}

export interface UpdatePlanRequest {
  description?: string;
  price?: number;
  durationDays?: number;
}
