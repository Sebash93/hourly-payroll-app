/* eslint-disable no-underscore-dangle */
/* eslint-disable import/prefer-default-export */
import {
  COLLECTION,
  EmployeeCollection,
  PayrollCollection,
  TemplateCollection,
} from 'renderer/db/db';
import { useRxData } from 'rxdb-hooks';

const isFetchingSomething = (...args: boolean[]) => {
  return args.some((a) => a);
};

export const usePayrollStore = (templateId?: string) => {
  const options = templateId ? { selector: { templateId } } : {};
  return useRxData<PayrollCollection>(COLLECTION.PAYROLL, (collection) =>
    collection.find(options)
  );
};

export const useOneTemplateStore = (templateId?: string) => {
  return useRxData<TemplateCollection>(COLLECTION.TEMPLATE, (collection) =>
    collection.findOne({ selector: { id: templateId } })
  );
};

export const useTemplateStore = (limit: number = 0) => {
  return useRxData<TemplateCollection>(COLLECTION.TEMPLATE, (collection) =>
    collection.find({
      sort: [{ start_date: 'desc' }],
      limit,
    })
  );
};

export const useEmployeeStore = () => {
  return useRxData<EmployeeCollection>(COLLECTION.EMPLOYEE, (collection) =>
    collection.find({
      sort: [{ checkedByDefault: 'asc' }],
    })
  );
};

export interface AugementedTemplate extends TemplateCollection {
  employeesData: EmployeeCollection[];
  hasPayrollData: boolean;
}

export const useAugmentedTemplateStore = () => {
  const { result: employeesData, isFetching: isFetchingEmployees } =
    useEmployeeStore();
  const { result: payrollData, isFetching: isFetchingPayroll } =
    usePayrollStore();
  const { result: templatesData, isFetching: isFetchingTemplates } =
    useTemplateStore();

  const isFetching = isFetchingSomething(
    isFetchingEmployees,
    isFetchingPayroll,
    isFetchingTemplates
  );

  let result: AugementedTemplate[] = [];

  if (!isFetching) {
    result = templatesData.map((template) => {
      const employees = employeesData.filter((employee) =>
        template.employees.includes(employee.id)
      );
      const hasPayrollData = payrollData.some(
        (payroll) => payroll.templateId === template.id
      );
      const templateData = template._data as TemplateCollection;
      return {
        ...templateData,
        employeesData: employees,
        hasPayrollData,
      };
    });
  }

  return {
    isFetching,
    result,
  };
};
