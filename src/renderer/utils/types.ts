import { EmployeeCollection, PayrollCollection } from 'renderer/db/db';

export interface PayrollWithEmployees extends PayrollCollection {
  employee: EmployeeCollection;
}
