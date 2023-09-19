import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ArticleIcon from '@mui/icons-material/Article';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import PersonIcon from '@mui/icons-material/Person';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { EmployeeCollection, TemplateCollection } from 'renderer/db/db';
import {
  SHORT_DATE_FORMAT,
  fromTimestampToHumanDate,
} from 'renderer/utils/dates';

interface TemplateItemProps {
  data: TemplateCollection;
  employeesIds: string[];
  employeesData: EmployeeCollection[];
  onDelete: (id: string) => void;
  onPrint: (id: string) => void;
  onPayrollClick: (id: string) => void;
}

export default function TemplateItem({
  data,
  employeesIds,
  employeesData,
  onDelete,
  onPrint,
  onPayrollClick,
}: TemplateItemProps) {
  const [employees, setEmployees] = useState<EmployeeCollection[]>([]);
  useEffect(() => {
    const employeesList = employeesData.filter((employee) =>
      employeesIds.includes(employee.id)
    );
    setEmployees(employeesList);
  }, [employeesIds, employeesData]);

  return (
    <Card sx={{ p: 1 }}>
      <CardContent>
        <Typography variant="h6" component="div">
          <b>
            {format(new Date(data.start_date), SHORT_DATE_FORMAT)} al{' '}
            {format(new Date(data.end_date), SHORT_DATE_FORMAT)}
          </b>
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography
              sx={{ fontSize: 14 }}
              color="text.secondary"
              gutterBottom
            >
              Dias Festivos
            </Typography>
            <List dense>
              {data?.holidays?.map((holiday) => (
                <ListItem key={holiday}>
                  <ListItemIcon>
                    <WbSunnyIcon />
                  </ListItemIcon>
                  <ListItemText primary={fromTimestampToHumanDate(holiday)} />
                </ListItem>
              ))}
            </List>
          </Grid>
          <Grid item xs={12}>
            <Typography
              sx={{ fontSize: 14 }}
              color="text.secondary"
              gutterBottom
            >
              Empleados ({employeesIds?.length})
            </Typography>
            <List dense>
              {employees.map((employee) => (
                <ListItem key={employee.id}>
                  <ListItemIcon>
                    <PersonIcon />
                  </ListItemIcon>
                  <ListItemText primary={employee.name} />
                </ListItem>
              ))}
            </List>
          </Grid>
        </Grid>
      </CardContent>
      <CardActions sx={{ justifyContent: 'flex-end' }}>
        <Button
          onClick={() => onDelete(data.id)}
          size="small"
          color="error"
          endIcon={<DeleteOutlineIcon />}
        >
          Borrar
        </Button>
        <Button
          onClick={() => onPrint(data.id)}
          size="small"
          variant="outlined"
          endIcon={<ArticleIcon />}
        >
          Documentos
        </Button>
        <Button
          onClick={() => onPayrollClick(data.id)}
          size="small"
          endIcon={<AccessTimeIcon />}
          variant="contained"
        >
          Horas
        </Button>
      </CardActions>
    </Card>
  );
}
