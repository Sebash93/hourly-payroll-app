/* eslint-disable camelcase */
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import { useMemo, useState } from 'react';

import currency from 'currency.js';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import {
  COLLECTION,
  EmployeeCollection,
  PayrollCollection,
  TemplateCollection,
} from 'renderer/db/db';
import {
  CURRENCY_FORMAT,
  generatePayrollHoursRows,
} from 'renderer/utils/adapters';
import config from 'renderer/utils/config';
import { fromDateToTimestamp } from 'renderer/utils/dates';
import { useRxCollection } from 'rxdb-hooks';
import HoursTable from './HoursTable';
import { RowState } from './HoursTableRow';

interface PayrollHoursDialogProps {
  open: boolean;
  handleClose: () => void;
  employee: EmployeeCollection;
  template: TemplateCollection;
  startDate: string;
  endDate: string;
}

interface TotalHours {
  common?: number;
  holiday?: number;
}

interface Inputs {
  totalHours: TotalHours;
  hourly_rate: number;
  holiday_hourly_rate: number;
  bonus: number;
}

const defaultValues = {
  totalHours: {},
  hourly_rate: config.DEFAULT_COMMON_HOUR_VALUE,
  holiday_hourly_rate: config.DEFAULT_HOLIDAY_HOUR_VALUE,
  bonus: config.DEFAULT_BONUS,
};

export default function PayrollHoursDialog({
  open,
  handleClose,
  employee,
  template,
  startDate,
  endDate,
}: PayrollHoursDialogProps) {
  const [totalHours, setTotalHours] = useState<TotalHours>({});
  const [hoursData, setHoursData] = useState<Record<string, RowState>>({});
  const [paymentAmount, setPaymentAmount] = useState<number>(0);

  const hoursRows = useMemo(
    () => generatePayrollHoursRows(template),
    [template]
  );

  const { handleSubmit, control, register, reset, getValues, formState } =
    useForm<Inputs>({
      criteriaMode: 'all',
      defaultValues,
    });

  const collection = useRxCollection(COLLECTION.PAYROLL);

  const calculate = () => {
    const { totalHours, hourly_rate, holiday_hourly_rate, bonus } = getValues();
    const paymentAmount =
      totalHours.common * parseInt(hourly_rate) +
      totalHours.holiday * parseInt(holiday_hourly_rate) +
      parseInt(bonus ?? '0');
    setPaymentAmount(paymentAmount);
  };

  const onClose = () => {
    reset(defaultValues);
    setTotalHours({});
    setHoursData({});
    setPaymentAmount(0);
    handleClose();
  };

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const formattedHours = Object.keys(hoursData).reduce((acc, date) => {
      const { startTime, endTime, first_break, second_break } = hoursData[date];
      if (!startTime || !endTime) {
        return acc;
      }
      return {
        ...acc,
        [date]: {
          startTime: fromDateToTimestamp(startTime),
          endTime: fromDateToTimestamp(endTime),
          first_break,
          second_break,
        },
      };
    }, {});
    const formattedData: PayrollCollection = {
      id: `${employee.id}-${template.id}`,
      employeeId: employee.id,
      templateId: template.id,
      hourly_rate: data.hourly_rate,
      holiday_hourly_rate: data.holiday_hourly_rate,
      bonus: data.bonus,
      hours: formattedHours,
      payment_amount: paymentAmount,
      total_common_hours: totalHours.common ?? 0,
      total_holiday_hours: totalHours.holiday ?? 0,
    };

    try {
      await collection?.upsert(formattedData);
      onClose();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Dialog fullWidth maxWidth="xl" open={open} onClose={onClose}>
      <DialogTitle>
        Horas del {startDate} al {endDate}
      </DialogTitle>
      <DialogContent>
        <Box
          noValidate
          component="form"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            m: 'auto',
            width: 'fit-content',
          }}
        >
          <Grid container spacing={2} sx={{ marginBottom: 4 }}>
            <Grid item xs={12}>
              <Typography variant="h4">{employee.name}</Typography>
            </Grid>
            <Grid item xs={12} lg={2} sm={3}>
              <TextField
                id="hourly_rate"
                label="Valor Hora Común"
                variant="outlined"
                size="small"
                type="number"
                fullWidth
                InputProps={{
                  inputMode: 'numeric',

                  startAdornment: (
                    <InputAdornment position="start">$</InputAdornment>
                  ),
                }}
                {...register('hourly_rate', { required: true })}
              />
            </Grid>
            <Grid item xs={12} lg={2} sm={3}>
              <TextField
                id="holiday_hourly_rate"
                label="Valor Hora Festiva"
                variant="outlined"
                size="small"
                type="number"
                fullWidth
                InputProps={{
                  inputMode: 'numeric',

                  startAdornment: (
                    <InputAdornment position="start">$</InputAdornment>
                  ),
                }}
                {...register('holiday_hourly_rate', { required: true })}
              />
            </Grid>
            <Grid item xs={12} lg={2} sm={3}>
              <TextField
                id="bonus"
                label="Bonificación"
                variant="outlined"
                size="small"
                type="number"
                fullWidth
                InputProps={{
                  inputMode: 'numeric',
                  startAdornment: (
                    <InputAdornment position="start">$</InputAdornment>
                  ),
                }}
                {...register('bonus', { required: true })}
              />
            </Grid>
            <Grid
              item
              xs={12}
              sm={6}
              sx={{ display: 'flex', justifyContent: 'flex-end' }}
            >
              <Typography
                variant="h6"
                sx={{ display: 'inline-block', marginRight: 4 }}
              >
                H. Común: {totalHours.common}
              </Typography>
              <Typography
                variant="h6"
                sx={{ display: 'inline-block', marginRight: 4 }}
              >
                H. Festiva: {totalHours.holiday}
              </Typography>
              <Typography variant="h6" sx={{ display: 'inline-block' }}>
                Pago Total: {currency(paymentAmount, CURRENCY_FORMAT).format()}
              </Typography>
            </Grid>
          </Grid>
          <Controller
            name="totalHours"
            control={control}
            rules={{ required: 'La fecha inicial del periodo es requerida' }}
            render={({ field }) => (
              <HoursTable
                rows={hoursRows}
                onTableStateChange={(rowsData) => {
                  setHoursData(rowsData);
                }}
                onTotalHoursChange={(hours) => {
                  setTotalHours(hours);
                  field.onChange(hours);
                  calculate();
                }}
                onSaveClick={handleSubmit(onSubmit)}
              />
            )}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cerrar</Button>
      </DialogActions>
    </Dialog>
  );
}
