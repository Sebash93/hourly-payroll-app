import { createRxDatabase, addRxPlugin } from 'rxdb';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode';

export enum COLLECTION {
  EMPLOYEE = 'employee',
  TEMPLATE = 'template',
  PAYROLL = 'payroll',
}

export interface EmployeeCollection {
  id: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  checkedByDefault: boolean;
}

export interface TemplateCollection {
  id: string;
  start_date: number;
  end_date: number;
  holidays: number[];
  sundays: number[];
  employees: string[];
}

export interface PayrollHours {
  start_time: number;
  end_time: number;
  first_break: boolean;
  second_break: boolean;
}

export interface PayrollCollection {
  id: string;
  hourly_rate: number;
  holiday_hourly_rate: number;
  bonus: number;
  employee: string;
  hours: PayrollHours[];
  total_common_hours: number;
  total_holiday_hours: number;
  payment_amount: number;
}

addRxPlugin(RxDBDevModePlugin);

export default async function initialize() {
  const db = await createRxDatabase({
    name: 'test3',
    storage: getRxStorageDexie(),
    ignoreDuplicate: true,
  });

  await db.addCollections({
    employee: {
      schema: {
        title: 'employee',
        version: 0,
        type: 'object',
        primaryKey: 'id',
        properties: {
          id: {
            type: 'string',
            maxLength: 100,
          },
          name: {
            type: 'string',
          },
          address: {
            type: 'string',
          },
          city: {
            type: 'string',
          },
          phone: {
            type: 'string',
          },
          checkedByDefault: {
            type: 'boolean',
            default: true,
          },
        },
      },
    },
    template: {
      schema: {
        title: 'templates',
        version: 0,
        type: 'object',
        primaryKey: 'id',
        properties: {
          id: {
            type: 'string',
            maxLength: 100,
          },
          start_date: {
            type: 'number',
          },
          end_date: {
            type: 'number',
          },
          holidays: {
            type: 'array',
            uniqueItems: true,
            items: {
              type: 'number',
            },
          },
          sundays: {
            type: 'array',
            uniqueItems: true,
            items: {
              type: 'number',
            },
          },
          employees: {
            type: 'array',
            uniqueItems: true,
            ref: 'employee',
            items: {
              type: 'string',
            },
          },
        },
      },
    },
    payroll: {
      schema: {
        title: 'payroll',
        version: 0,
        type: 'object',
        primaryKey: 'id',
        properties: {
          id: {
            type: 'string',
            maxLength: 100,
          },
          hourly_rate: {
            type: 'number',
          },
          holiday_hourly_rate: {
            type: 'number',
          },
          bonus: {
            type: 'number',
          },
          employee: {
            type: 'string',
            ref: 'employee',
          },
          hours: {
            type: 'array',
            uniqueItems: true,
            items: {
              type: 'object',
              properties: {
                start_time: {
                  type: 'number',
                },
                end_time: {
                  type: 'number',
                },
                first_break: {
                  type: 'boolean',
                },
                second_break: {
                  type: 'boolean',
                },
              },
            },
          },
          total_common_hours: {
            type: 'number',
          },
          total_holiday_hours: {
            type: 'number',
          },
          payment_amount: {
            type: 'number',
          },
        },
      },
    },
  });

  // maybe sync collection to a remote
  // ...

  return db;
}
