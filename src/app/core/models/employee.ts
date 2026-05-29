import { EmployeeStatus } from './admin-role';

export interface EmployeeSummary {
  id: number;
  name: string | null;
  email: string | null;
  position: string | null;
  departmentName: string | null;
  salary: number | null;
  status: EmployeeStatus;
  tenantId: string | null;
  hireDate: string | null;
}
