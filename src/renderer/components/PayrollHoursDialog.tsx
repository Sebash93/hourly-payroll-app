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

import { EmployeeCollection, TemplateCollection } from 'renderer/db/db';
import { generatePayrollHoursRows } from 'renderer/utils/adapters';
import HoursTable from './HoursTable';
import { Controller, useForm } from 'react-hook-form';

interface PayrollHoursDialogProps {
  open: boolean;
  handleClose: () => void;
  employee: EmployeeCollection;
  template: TemplateCollection;
  shorStartDate: string;
  humanEndDate: string;
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

export default function PayrollHoursDialog({
  open,
  handleClose,
  employee,
  template,
  shorStartDate,
  humanEndDate,
}: PayrollHoursDialogProps) {
  const [totalHours, setTotalHours] = useState<TotalHours>({});
  const [paymentAmount, setPaymentAmount] = useState<number>(0);

  const hoursRows = useMemo(
    () => generatePayrollHoursRows(template),
    [template]
  );

  const {
    handleSubmit,
    control,
    register,
    getValues,
    formState: { errors },
  } = useForm<Inputs>({
    criteriaMode: 'all',
  });

  const calculate = () => {
    const { totalHours, hourly_rate, holiday_hourly_rate, bonus } = getValues();
    console.log({ totalHours, hourly_rate, holiday_hourly_rate, bonus });
    const paymentAmount =
      totalHours.common * parseInt(hourly_rate) +
      totalHours.holiday * parseInt(holiday_hourly_rate) +
      parseInt(bonus);
    setPaymentAmount(paymentAmount);
  };

  return (
    <Dialog fullWidth maxWidth="xl" open={open} onClose={handleClose}>
      <DialogTitle>
        Horas del {shorStartDate} hasta el {humanEndDate}
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
                Pago Total: {paymentAmount}
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
                onTotalHoursChange={(hours) => {
                  setTotalHours(hours);
                  field.onChange(hours);
                  calculate();
                }}
              />
            )}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cerrar y borrar</Button>
      </DialogActions>
    </Dialog>
  );
}
