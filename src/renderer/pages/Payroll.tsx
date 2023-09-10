import { CircularProgress, Grid, Paper, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import EmployeeCard from 'renderer/components/EmployeeCard';
import PayrollHoursDialog from 'renderer/components/PayrollHoursDialog';
import { COLLECTION, EmployeeCollection } from 'renderer/db/db';
import { RxQueryResultDoc, useRxData } from 'rxdb-hooks';

export default function PayrollPage() {
  const [open, setOpen] = useState(true);
  // selectedEmployee state
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeCollection>(
    {}
  );

  // employess state
  const [employees, setEmployees] = useState<EmployeeCollection[]>([]);

  // Load templates
  const { result: templates, isFetching } = useRxData(
    COLLECTION.TEMPLATE,
    (collection) => collection.find({})
  );

  // Load employees
  useEffect(() => {
    async function populateEmployees() {
      if (templates.length === 0) return;
      const templateEmployees = await templates[0].populate('employees');
      setEmployees(templateEmployees);
    }
    populateEmployees();
  }, [templates]);

  const handleEmployeeClick = (employee: EmployeeCollection) => {
    setSelectedEmployee(employee);
    setOpen(true);
  };

  /*  template[0].populate('employees'); */
  if (isFetching) return <CircularProgress />;
  return (
    <Paper sx={{ padding: '24px' }}>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Typography
            variant="h4"
            gutterBottom
            sx={{ display: 'flex', justifyContent: 'space-between' }}
          >
            Crear Nómina
            {/* <Button
              variant="contained"
              endIcon={<CheckIcon />}
              onClick={handleSubmit(onSubmit)}
            >
              Guardar
            </Button> */}
          </Typography>
        </Grid>
      </Grid>
      <Grid container spacing={4}>
        {employees.map((employee) => (
          <Grid item lg={3} md={4} sm={6} xs={12}>
            <EmployeeCard
              name={employee.name}
              onClick={() => handleEmployeeClick(employee)}
            />
          </Grid>
        ))}
      </Grid>
      <PayrollHoursDialog
        open={open}
        handleClose={() => setOpen(false)}
        employee={selectedEmployee}
        template={templates[0]}
      />
    </Paper>
  );
}
