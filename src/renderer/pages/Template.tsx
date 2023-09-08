import { Button, Checkbox, FormControlLabel, FormGroup } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import NewEmployeeDialog from 'renderer/components/NewEmployeeDialog';
import { COLLECTION } from 'renderer/db/db';
import { useRxData } from 'rxdb-hooks';

export default function TemplatePage() {
  const { result: employees, isFetching } = useRxData(
    COLLECTION.EMPLOYEE,
    (collection) =>
      collection.find({
        selector: {},
      })
  );

  if (isFetching) {
    return 'loading characters...';
  }

  return (
    <div>
      <h2>Crear Plantilla</h2>
      <h3>Periodo</h3>
      <DatePicker label="Fecha inicial" />
      <DatePicker label="Fecha final" />
      <h3>Dias festivos</h3>
      <DatePicker label="Agrega un dia festivo" />
      <h3>Empleados</h3>
      <NewEmployeeDialog />
      <FormGroup>
        {employees?.length &&
          employees.map(({ name, defaultChecked }) => (
            <FormControlLabel
              control={<Checkbox defaultChecked={defaultChecked} />}
              label={name}
            />
          ))}
      </FormGroup>
      <Button variant="contained">Guardar Plantilla</Button>
    </div>
  );
}
