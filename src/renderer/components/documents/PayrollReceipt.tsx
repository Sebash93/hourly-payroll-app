import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import currency from 'currency.js';
import { format } from 'date-fns';
import { TemplateCollection } from 'renderer/db';
import {
  CURRENCY_FORMAT,
  generatePayrollHoursReceiptModel,
} from 'renderer/utils/adapters';
import config from 'renderer/utils/config';
import { LARGE_DATE_FORMAT } from 'renderer/utils/dates';
import { PayrollWithEmployees } from 'renderer/utils/types';

interface PayrollReceiptProps {
  employeePayroll: PayrollWithEmployees;
  template: TemplateCollection;
}

export default function PayrollReceipt({
  employeePayroll,
  template,
}: PayrollReceiptProps) {
  const hoursInfo = generatePayrollHoursReceiptModel(employeePayroll.hours);
  return (
    <TableContainer className="page">
      <Table
        sx={{ minWidth: 650, border: 1, marginBottom: '20px' }}
        size="small"
      >
        <TableHead>
          <TableRow>
            <TableCell colSpan={2} sx={{ width: '40%' }}>
              <Typography variant="h5">Comprobante de Egreso</Typography>
            </TableCell>
            <TableCell>
              Ciudad:{' '}
              <Typography variant="h6" sx={{ display: 'inline-block' }}>
                {config.COMPANY_INFO.city}
              </Typography>
            </TableCell>
            <TableCell>
              Fecha:{' '}
              <Typography variant="h6" sx={{ display: 'inline-block' }}>
                {format(new Date(), LARGE_DATE_FORMAT)}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell sx={{ verticalAlign: 'top' }}>
              Pagado a:
              <Typography variant="h6">
                {employeePayroll.employee.name}
              </Typography>
            </TableCell>
            <TableCell sx={{ verticalAlign: 'top' }}>
              Por valor de:
              <Typography variant="h6">
                {currency(
                  employeePayroll.payment_amount,
                  CURRENCY_FORMAT
                ).format()}
              </Typography>
            </TableCell>
            <TableCell colSpan={2} sx={{ verticalAlign: 'top' }}>
              Por concepto de:
              <Typography variant="h6">
                {config.COMPANY_INFO.payrollDetail} en el periodo del{' '}
                {format(new Date(template.start_date), LARGE_DATE_FORMAT)} al{' '}
                {format(new Date(template.end_date), LARGE_DATE_FORMAT)}
              </Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableRow>
          <TableCell colSpan={4} sx={{ padding: 2 }}>
            <Table size="small" sx={{ border: 1 }}>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <b>Día</b>
                  </TableCell>
                  <TableCell sx={{ width: '15%' }}>
                    <b>Inicio</b>
                  </TableCell>
                  <TableCell sx={{ width: '18%' }}>
                    <b>Salida</b>
                  </TableCell>
                  <TableCell sx={{ width: '20%' }}>
                    <b>Descansos</b>
                  </TableCell>
                  <TableCell sx={{ width: '22%' }}>
                    <b>Total Horas</b>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {hoursInfo.map((day) => {
                  return (
                    <TableRow key={day.id}>
                      <TableCell>{day.day}</TableCell>
                      <TableCell>{day.startTime}</TableCell>
                      <TableCell>{day.endTime}</TableCell>
                      <TableCell>{day.descansos}</TableCell>
                      <TableCell>{day.hours}</TableCell>
                    </TableRow>
                  );
                })}
                <TableRow>
                  <TableCell colSpan={2}>
                    Horas comun: {employeePayroll.total_common_hours} / Valor x
                    hora:{' '}
                    {currency(
                      employeePayroll.hourly_rate,
                      CURRENCY_FORMAT
                    ).format()}
                    <br />
                    <b>Total pago horas comun:</b>{' '}
                    {currency(
                      employeePayroll.total_common_hours *
                        employeePayroll.hourly_rate,
                      CURRENCY_FORMAT
                    ).format()}
                  </TableCell>
                  <TableCell colSpan={2}>
                    Horas Festivo: {employeePayroll.total_holiday_hours} / Valor
                    x hora:{' '}
                    {currency(
                      employeePayroll.holiday_hourly_rate,
                      CURRENCY_FORMAT
                    ).format()}
                    <br />
                    <b>Total pago horas festivo:</b>{' '}
                    {currency(
                      employeePayroll.total_holiday_hours *
                        employeePayroll.holiday_hourly_rate,
                      CURRENCY_FORMAT
                    ).format()}
                  </TableCell>
                  <TableCell>
                    {employeePayroll.bonus
                      ? `Bonificación: ${employeePayroll.bonus}`
                      : ''}
                    <br />
                    <b>TOTAL:</b>{' '}
                    {currency(
                      employeePayroll.payment_amount,
                      CURRENCY_FORMAT
                    ).format()}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell sx={{ height: '100px', verticalAlign: 'top' }} colSpan={2}>
            Elaborado por:
          </TableCell>
          <TableCell sx={{ verticalAlign: 'top' }} colSpan={2}>
            Firma Beneficiario / Cédula:
          </TableCell>
        </TableRow>
      </Table>
    </TableContainer>
  );
}
