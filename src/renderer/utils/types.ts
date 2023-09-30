import { EmployeeCollection, PayrollCollection } from 'renderer/db';

export interface PayrollWithEmployees extends PayrollCollection {
  employee: EmployeeCollection;
}
