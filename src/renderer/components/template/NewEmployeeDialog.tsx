import AddIcon from '@mui/icons-material/Add';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
} from '@mui/material';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useRxCollection } from 'rxdb-hooks';
import { COLLECTION } from '../../db';

type FormInputs = {
  name: string;
  address: string;
  city: string;
  id: string;
  phone: string;
};

const defaultValues = {
  name: '',
  address: '',
  city: '',
  id: '',
  phone: '',
};

export default function NewEmployeeDialog() {
  const [open, setOpen] = useState(false);
  const collection = useRxCollection(COLLECTION.EMPLOYEE);

  const { register, handleSubmit, reset } = useForm<FormInputs>();

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    await collection?.upsert(data);
    reset(defaultValues);
    setOpen(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button
        variant="outlined"
        onClick={() => setOpen(true)}
        startIcon={<AddIcon />}
        size="small"
        sx={{ mt: 1 }}
      >
        Agregar Nuevo Empleado
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          Nuevo Empleado
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item sm={8}>
              <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Nombre"
                type="text"
                fullWidth
                variant="standard"
                {...register('name', { required: true })}
              />
            </Grid>
            <Grid item sm={4}>
              <TextField
                margin="dense"
                id="id"
                label="Cédula/NIT"
                type="text"
                fullWidth
                variant="standard"
                {...register('id', { required: true })}
              />
            </Grid>
            <Grid item sm={8}>
              <TextField
                margin="dense"
                id="address"
                label="Dirección"
                type="text"
                fullWidth
                variant="standard"
                {...register('address')}
              />
            </Grid>
            <Grid item sm={4}>
              <TextField
                margin="dense"
                id="city"
                label="Ciudad"
                type="text"
                fullWidth
                variant="standard"
                {...register('city')}
              />
            </Grid>
          </Grid>

          <TextField
            margin="dense"
            id="phone"
            label="Teléfono"
            type="text"
            fullWidth
            variant="standard"
            {...register('phone')}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleSubmit(onSubmit)} variant="contained">
            Crear
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
