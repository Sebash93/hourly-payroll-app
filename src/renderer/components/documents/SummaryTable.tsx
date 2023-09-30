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
import theme from 'renderer/theme/theme';
import { CURRENCY_FORMAT } from 'renderer/utils/adapters';
import { LARGE_DATE_FORMAT } from 'renderer/utils/dates';

interface SummaryTableProps {
  payrollData: PayrollCollection[];
  employeesData: EmployeeCollection[];
  templateData: TemplateCollection;
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
    <TableContainer className="printable">
      <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell
              sx={{ backgroundColor: theme.palette.grey[300] }}
              colSpan={10}
              align="center"
            >
              Nómina del periodo del{' '}
              <b>
                {format(new Date(templateData.start_date), LARGE_DATE_FORMAT)}
              </b>{' '}
              al{' '}
              <b>
                {format(new Date(templateData.end_date), LARGE_DATE_FORMAT)}
              </b>
            </TableCell>
          </TableRow>
          <TableRow sx={{ backgroundColor: theme.palette.grey[200] }}>
            <TableCell sx={{ textAlign: 'center' }}>No.</TableCell>
            <TableCell>Nombre</TableCell>
            <TableCell sx={{ textAlign: 'center' }}>
              <b>Total</b>
            </TableCell>
            <TableCell sx={{ textAlign: 'center' }}>Horas Comun</TableCell>
            <TableCell sx={{ textAlign: 'center' }}>Valor Hora</TableCell>
            <TableCell sx={{ textAlign: 'center' }}>Total</TableCell>
            <TableCell sx={{ textAlign: 'center' }}>Horas Festivo</TableCell>
            <TableCell sx={{ textAlign: 'center' }}>Valor Hora</TableCell>
            <TableCell sx={{ textAlign: 'center' }}>Total</TableCell>
            <TableCell sx={{ textAlign: 'center' }}>Bonificación</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {payrollWithEmployees.map((payroll, index) => {
            return (
              <TableRow key={payroll.id}>
                <TableCell sx={{ textAlign: 'center' }}>{index + 1}</TableCell>
                <TableCell>{payroll.employee.name}</TableCell>
                <TableCell sx={{ textAlign: 'center' }}>
                  <b>
                    {currency(payroll.payment_amount, CURRENCY_FORMAT).format()}
                  </b>
                </TableCell>
                <TableCell sx={{ textAlign: 'center' }}>
                  {payroll.total_common_hours}
                </TableCell>
                <TableCell sx={{ textAlign: 'center' }}>
                  {currency(payroll.hourly_rate, CURRENCY_FORMAT).format()}
                </TableCell>
                <TableCell sx={{ textAlign: 'center' }}>
                  {currency(
                    payroll.total_common_hours * payroll.hourly_rate,
                    CURRENCY_FORMAT
                  ).format()}
                </TableCell>
                <TableCell sx={{ textAlign: 'center' }}>
                  {payroll.total_holiday_hours}
                </TableCell>
                <TableCell sx={{ textAlign: 'center' }}>
                  {currency(
                    payroll.holiday_hourly_rate,
                    CURRENCY_FORMAT
                  ).format()}
                </TableCell>
                <TableCell sx={{ textAlign: 'center' }}>
                  {currency(
                    payroll.total_holiday_hours * payroll.holiday_hourly_rate,
                    CURRENCY_FORMAT
                  ).format()}
                </TableCell>
                <TableCell sx={{ textAlign: 'center' }}>
                  {currency(payroll.bonus, CURRENCY_FORMAT).format()}
                </TableCell>
              </TableRow>
            );
          })}
          <TableRow
            sx={{
              backgroundColor: theme.palette.grey[300],
            }}
          >
            <TableCell colSpan={2}>
              <b>TOTAL EMPLEADOS</b>
            </TableCell>
            <TableCell sx={{ textAlign: 'center' }}>
              <b>{currency(total, CURRENCY_FORMAT).format()}</b>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}
