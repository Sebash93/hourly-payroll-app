import {
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
} from '@mui/material';
import AccessAlarmsIcon from '@mui/icons-material/AccessAlarms';

interface EmployeeCardProps {
  name: string;
  onClick: () => void;
}

export default function EmployeeCard({ name, onClick }: EmployeeCardProps) {
  return (
    <Card variant="outlined">
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          Nomina
        </Typography>
        <Typography variant="h5" component="div">
          {name}
        </Typography>
      </CardContent>
      <CardActions>
        <Button onClick={onClick} size="small" endIcon={<AccessAlarmsIcon />}>
          Diligenciar Horas
        </Button>
      </CardActions>
    </Card>
  );
}
