import {
  Alert,
  AlertTitle,
  Button,
  Grid,
  Paper,
  Typography,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import NewEmployeeDialog from 'renderer/components/NewEmployeeDialog';
import { COLLECTION, EmployeeCollection } from 'renderer/db/db';
import { useRxCollection, useRxData } from 'rxdb-hooks';
import CheckIcon from '@mui/icons-material/Check';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { fromDateToTimestamp } from 'renderer/utils/dates';
import HolidaySelector from 'renderer/components/HolidaySelector';
import EmployeesSelector from 'renderer/components/EmployeesSelector';
import { noEmptyArray } from 'renderer/utils/validations';
import { Dispatch } from 'react';
import snackbarReducer, {
  SnackbarAction,
  snackbarInitialState,
} from 'renderer/store/snackbar';

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
  const { result: employees, isFetching } = useRxData<EmployeeCollection>(
    COLLECTION.EMPLOYEE,
    (collection) =>
      collection.find({
        selector: {},
        sort: [{ checkedByDefault: 'asc' }],
      })
  );
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
    console.log('Dispatching');

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
      console.log(result);
      onSaveSuccess();
    } catch (error) {
      onSaveError(error);
    }
  };

  if (isFetching) {
    return 'loading characters...';
  }

  return (
    <Paper sx={{ padding: '24px' }}>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Typography
            variant="h4"
            gutterBottom
            sx={{ display: 'flex', justifyContent: 'space-between' }}
          >
            Crear Plantilla
            <Button
              variant="contained"
              endIcon={<CheckIcon />}
              onClick={handleSubmit(onSubmit)}
            >
              Guardar
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
          <Typography variant="h5" gutterBottom>
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
                onChange={(date) => {
                  const timestamp =
                    date instanceof Date ? fromDateToTimestamp(date) : 0;
                  field.onChange(timestamp);
                }}
              />
            )}
          />
          <Typography variant="h5" gutterBottom sx={{ marginTop: '16px' }}>
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
          <Typography variant="h5">Seleccionar Empleados</Typography>
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
  );
}
