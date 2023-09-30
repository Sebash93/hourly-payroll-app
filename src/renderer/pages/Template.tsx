import CheckIcon from '@mui/icons-material/Check';
import {
  Alert,
  AlertTitle,
  Button,
  Grid,
  Paper,
  Typography,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { Dispatch } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import EmployeesSelector from 'renderer/components/EmployeesSelector';
import HolidaySelector from 'renderer/components/HolidaySelector';
import NewEmployeeDialog from 'renderer/components/NewEmployeeDialog';
import TemplateView from 'renderer/components/TemplateView';
import { COLLECTION } from 'renderer/db/db';
import { SnackbarAction } from 'renderer/store/snackbar';
import { useEmployeeStore } from 'renderer/store/store';
import { fromDateToTimestamp } from 'renderer/utils/dates';
import { noEmptyArray } from 'renderer/utils/validations';
import { useRxCollection } from 'rxdb-hooks';

type Inputs = {
  start_date: number;
  end_date: number;
  holidays: number[];
  employees: string[];
};

export default function TemplatePage({
  snackbarDispatcher,
}: {
  snackbarDispatcher: Dispatch<SnackbarAction>;
}) {
  const { result: employees, isFetching } = useEmployeeStore();
  const collection = useRxCollection(COLLECTION.TEMPLATE);

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<Inputs>({
    criteriaMode: 'all',
  });

  const errorsArray = Object.keys(errors).map((key) => errors[key].message);

  function onSaveSuccess() {
    snackbarDispatcher({
      type: 'SHOW_SNACKBAR',
      payload: {
        message: 'Plantilla guardada correctamente',
        status: 'success',
      },
    });
  }

  function onSaveError(error) {
    snackbarDispatcher({
      type: 'SHOW_SNACKBAR',
      payload: {
        message: `Error guardando la plantilla: ${error.message}`,
        status: 'error',
      },
    });
  }

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const id = `${data.start_date}-${data.end_date}`;
    try {
      const result = await collection?.upsert({ ...data, id });
      onSaveSuccess();
    } catch (error) {
      onSaveError(error);
    }
  };

  if (isFetching) {
    return 'loading characters...';
  }

  return (
    <>
      <TemplateView employees={employees} />
      <Paper sx={{ padding: '24px' }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography
              variant="h5"
              sx={{ display: 'flex', justifyContent: 'space-between' }}
            >
              Nueva Planilla
              <Button
                color="success"
                variant="contained"
                endIcon={<CheckIcon />}
                onClick={handleSubmit(onSubmit)}
              >
                Crear
              </Button>
            </Typography>
          </Grid>
          {errorsArray.length > 0 && (
            <Grid item xs={12}>
              <Alert severity="error">
                <AlertTitle>Error Guradando la plantilla:</AlertTitle>
                {errorsArray.map((error) => (
                  <Typography key={error}>- {error}</Typography>
                ))}
              </Alert>
            </Grid>
          )}
          <Grid item lg={6} xs={12}>
            <Typography variant="h6" gutterBottom>
              Periodo
            </Typography>
            <Controller
              name="start_date"
              control={control}
              rules={{ required: 'La fecha inicial del periodo es requerida' }}
              render={({ field }) => (
                <DatePicker
                  sx={{ marginRight: '16px' }}
                  label="Fecha inicial"
                  format="dd/MM/yyyy"
                  slotProps={{
                    textField: {
                      size: 'small',
                    },
                  }}
                  onChange={(date) => {
                    const timestamp =
                      date instanceof Date ? fromDateToTimestamp(date) : 0;
                    field.onChange(timestamp);
                  }}
                />
              )}
            />
            <Controller
              name="end_date"
              control={control}
              rules={{ required: 'La fecha final del periodo es requerida' }}
              render={({ field }) => (
                <DatePicker
                  label="Fecha final"
                  format="dd/MM/yyyy"
                  slotProps={{
                    textField: {
                      size: 'small',
                    },
                  }}
                  onChange={(date) => {
                    const timestamp =
                      date instanceof Date ? fromDateToTimestamp(date) : 0;
                    field.onChange(timestamp);
                  }}
                />
              )}
            />
            <Typography variant="h6" gutterBottom sx={{ marginTop: '16px' }}>
              Días Festivos
            </Typography>
            <Controller
              name="holidays"
              control={control}
              render={({ field }) => (
                <HolidaySelector
                  onChange={(holidays) => {
                    field.onChange(holidays);
                  }}
                />
              )}
            />
          </Grid>
          <Grid item lg={6} xs={12}>
            <Typography variant="h6">Seleccionar Empleados</Typography>
            <Controller
              name="employees"
              control={control}
              rules={{
                validate: {
                  noEmptyArray,
                },
              }}
              render={({ field }) => (
                <EmployeesSelector
                  employees={employees}
                  onChange={(selectedEmployees) =>
                    field.onChange(selectedEmployees)
                  }
                />
              )}
            />
            <NewEmployeeDialog />
          </Grid>
        </Grid>
      </Paper>
    </>
  );
}
