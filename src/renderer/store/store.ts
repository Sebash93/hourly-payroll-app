/* eslint-disable no-underscore-dangle */
/* eslint-disable import/prefer-default-export */
import {
  COLLECTION,
  EmployeeCollection,
  PayrollCollection,
  TemplateCollection,
} from 'renderer/db';
import { useRxData } from 'rxdb-hooks';

const isFetchingSomething = (...args: boolean[]) => {
  return args.some((a) => a);
};

export const useOnePayrollStore = (payrollId?: string) => {
  const res = useRxData<PayrollCollection>(COLLECTION.PAYROLL, (collection) =>
    collection.findOne({ selector: { id: payrollId } })
  );
  return {
    ...res,
    result: res.result[0],
  };
};

export const usePayrollStore = (templateId?: string) => {
  const options = templateId ? { selector: { templateId } } : {};
  return useRxData<PayrollCollection>(COLLECTION.PAYROLL, (collection) =>
    collection.find(options)
  );
};

export const useOneTemplateStore = (templateId?: string) => {
  const res = useRxData<TemplateCollection>(COLLECTION.TEMPLATE, (collection) =>
    collection.findOne({ selector: { id: templateId } })
  );
  return {
    ...res,
    result: res.result[0],
  };
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

export interface AugmentedOneTemplate extends TemplateCollection {
  employeesData: EmployeeCollection[];
  hasPayrollData: boolean;
}

export const useAugmentedOneTemplateStore = (templateId: string) => {
  const { result: templateData, isFetching: isFetchingTemplate } =
    useOneTemplateStore(templateId);
  const { result: employeesData, isFetching: isFetchingEmployees } =
    useEmployeeStore();
  const { result: templatePayroll, isFetching: isFetchingPayroll } =
    usePayrollStore(templateId);
  let result: AugmentedOneTemplate = {};

  const isFetching = isFetchingSomething(
    isFetchingTemplate,
    isFetchingEmployees,
    isFetchingPayroll
  );
  if (!isFetching) {
    const employees = employeesData.filter((employee) =>
      templateData.employees.includes(employee.id)
    );
    const hasPayrollData = !!templatePayroll.length;
    const template = templateData._data as TemplateCollection;
    result = {
      ...template,
      hasPayrollData,
      employeesData: employees,
    };
  }

  return {
    isFetching,
    result,
  };
};

export interface AugementedPayroll extends PayrollCollection {
  employeeData: EmployeeCollection;
}

export const useAugmentedPayrollStore = (templateId: string) => {
  const { result: employeesData, isFetching: isFetchingEmployees } =
    useEmployeeStore();
  const { result: payroll, isFetching: isFetchingPayroll } =
    usePayrollStore(templateId);

  const isFetching = isFetchingSomething(
    isFetchingEmployees,
    isFetchingPayroll
  );

  let result: AugementedPayroll[] = [];

  if (!isFetching) {
    result = payroll.map((payrollItem) => {
      const employeeData = employeesData.find(
        (employee) => employee.id === payrollItem.employeeId
      );
      return {
        ...payrollItem._data,
        employeeData: employeeData as EmployeeCollection,
      };
    });
  }

  return {
    isFetching,
    result,
  };
};
