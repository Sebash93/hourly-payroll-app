import { ExpandLess, ExpandMore } from '@mui/icons-material';
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
  Collapse,
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
  index: number;
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
  index,
}: TemplateItemProps) {
  const [employees, setEmployees] = useState<EmployeeCollection[]>([]);
  const [holidaysOpen, setHolidaysOpen] = useState(index === 0);
  const [employeesOpen, setEmployeesOpen] = useState(index === 0);

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
              sx={{
                fontSize: 16,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                ':hover': {
                  cursor: 'pointer',
                },
              }}
              color="text.secondary"
              gutterBottom
              onClick={() => setHolidaysOpen(!holidaysOpen)}
            >
              Dias Festivos {holidaysOpen! ? <ExpandLess /> : <ExpandMore />}
            </Typography>
            <Collapse in={holidaysOpen} timeout="auto" unmountOnExit>
              <List component="div" dense>
                {data?.holidays?.map((holiday) => (
                  <ListItem key={holiday}>
                    <ListItemIcon>
                      <WbSunnyIcon />
                    </ListItemIcon>
                    <ListItemText primary={fromTimestampToHumanDate(holiday)} />
                  </ListItem>
                ))}
              </List>
            </Collapse>
          </Grid>
          <Grid item xs={12}>
            <Typography
              sx={{
                fontSize: 16,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                ':hover': {
                  cursor: 'pointer',
                },
              }}
              color="text.secondary"
              gutterBottom
              onClick={() => setEmployeesOpen(!employeesOpen)}
            >
              Empleados ({employeesIds?.length})
              {employeesOpen! ? <ExpandLess /> : <ExpandMore />}
            </Typography>
            <Collapse in={employeesOpen} timeout="auto" unmountOnExit>
              <List component="div" dense>
                {employees.map((employee) => (
                  <ListItem key={employee.id}>
                    <ListItemIcon>
                      <PersonIcon />
                    </ListItemIcon>
                    <ListItemText primary={employee.name} />
                  </ListItem>
                ))}
              </List>
            </Collapse>
          </Grid>
        </Grid>
      </CardContent>
      <CardActions sx={{ justifyContent: 'flex-end' }}>
        <Button
          onClick={() => onDelete(data.id)}
          size="small"
          color="error"
          disabled
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
