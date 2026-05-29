import { LeaveStatus, LeaveType } from './admin-role';

export interface LeaveSummary {
  id: number;
  employeeId: number;
  employeeName: string | null;
  tenantId: string | null;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  days: number | null;
  reason: string;
  status: LeaveStatus;
  appliedDate: string;
  approvedBy: string | null;
  approvedDate: string | null;
  rejectionReason: string | null;
}
