import {
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import currency from 'currency.js';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import {
  EmployeeCollection,
  PayrollCollection,
  TemplateCollection,
} from 'renderer/db/db';
import { CURRENCY_FORMAT } from 'renderer/utils/adapters';
import { LARGE_DATE_FORMAT } from 'renderer/utils/dates';

interface SummaryTableProps {
  payrollData: PayrollCollection[];
  employeesData: EmployeeCollection[];
  templateData: TemplateCollection;
}

interface PayrollWithEmployees extends PayrollCollection {
  employee: EmployeeCollection;
}

export default function SummaryTable({
  payrollData,
  employeesData,
  templateData,
}: SummaryTableProps) {
  const [payrollWithEmployees, setPayrollWithEmployees] =
    useState<PayrollWithEmployees[]>();
  const [total, setTotal] = useState<number>(0);

  useEffect(() => {
    if (!payrollData?.length || !employeesData?.length) return;
    let newTotal = 0;
    const newPayroll = payrollData.map((payroll) => {
      const employeeInfo = employeesData.find(
        (employee) => employee.id === payroll.employeeId
      );
      newTotal += payroll.payment_amount;
      return {
        ...payroll._data,
        employee: employeeInfo,
      };
    });
    setTotal(newTotal);
    setPayrollWithEmployees(newPayroll);
  }, [payrollData, employeesData]);

  if (!payrollWithEmployees?.length) return <CircularProgress />;
  return (
    <TableContainer id="table-toprint">
      <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell colSpan={10} align="center">
              Nómina del periodo del{' '}
              {format(new Date(templateData.start_date), LARGE_DATE_FORMAT)} al{' '}
              {format(new Date(templateData.end_date), LARGE_DATE_FORMAT)}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>No.</TableCell>
            <TableCell>Nombre</TableCell>
            <TableCell>Total</TableCell>
            <TableCell>Horas Comun</TableCell>
            <TableCell>Valor Hora</TableCell>
            <TableCell>Total</TableCell>
            <TableCell>Horas Festivo</TableCell>
            <TableCell>Valor Hora</TableCell>
            <TableCell>Total</TableCell>
            <TableCell>Bonificación</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {payrollWithEmployees.map((payroll, index) => {
            return (
              <TableRow key={payroll.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{payroll.employee.name}</TableCell>
                <TableCell>
                  {currency(payroll.payment_amount, CURRENCY_FORMAT).format()}
                </TableCell>
                <TableCell>{payroll.total_common_hours}</TableCell>
                <TableCell>
                  {currency(payroll.hourly_rate, CURRENCY_FORMAT).format()}
                </TableCell>
                <TableCell>
                  {currency(
                    payroll.total_common_hours * payroll.hourly_rate,
                    CURRENCY_FORMAT
                  ).format()}
                </TableCell>
                <TableCell>{payroll.total_holiday_hours}</TableCell>
                <TableCell>
                  {currency(
                    payroll.holiday_hourly_rate,
                    CURRENCY_FORMAT
                  ).format()}
                </TableCell>
                <TableCell>
                  {currency(
                    payroll.total_holiday_hours * payroll.holiday_hourly_rate,
                    CURRENCY_FORMAT
                  ).format()}
                </TableCell>
                <TableCell>
                  {currency(payroll.bonus, CURRENCY_FORMAT).format()}
                </TableCell>
              </TableRow>
            );
          })}
          <TableRow>
            <TableCell colSpan={2}>Total Empleados</TableCell>
            <TableCell colSpan={9}>
              {currency(total, CURRENCY_FORMAT).format()}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}
