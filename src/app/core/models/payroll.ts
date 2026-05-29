import { PayrollStatus } from './admin-role';

export interface SalarySlipSummary {
  id: number;
  employeeId: number;
  employeeName: string | null;
  tenantId: string | null;
  month: string;
  grossSalary: number | null;
  netSalary: number | null;
  status: PayrollStatus;
  generatedDate: string;
  paymentDate: string | null;
}

export interface PayrollSummary {
  month: string;
  slipCount: number;
  generated: number;
  sent: number;
  paid: number;
  onHold: number;
  totalNet: number;
}
