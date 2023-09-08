import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  TextField,
} from '@mui/material';
import { useRxCollection } from 'rxdb-hooks';
import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { COLLECTION } from '../db/db';

type Inputs = {
  name: string;
  address: string;
  city: string;
  id: string;
  phone: string;
};

export default function NewEmployeeDialog() {
  const [open, setOpen] = useState(false);
  const collection = useRxCollection(COLLECTION.EMPLOYEE);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    await collection?.upsert(data);
    setOpen(false);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen}>
        Agregar Nuevo Empleado
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogContent>
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
          <TextField
            margin="dense"
            id="id"
            label="Cédula/NIT"
            type="text"
            fullWidth
            variant="standard"
            {...register('id', { required: true })}
          />
          <TextField
            margin="dense"
            id="address"
            label="Dirección"
            type="text"
            fullWidth
            variant="standard"
            {...register('address')}
          />
          <TextField
            margin="dense"
            id="city"
            label="Ciudad"
            type="text"
            fullWidth
            variant="standard"
            {...register('city')}
          />
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
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
