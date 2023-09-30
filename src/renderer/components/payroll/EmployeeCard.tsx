import AccessAlarmsIcon from '@mui/icons-material/AccessAlarms';
import DoneIcon from '@mui/icons-material/Done';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Typography,
} from '@mui/material';
import currency from 'currency.js';
import { useOnePayrollStore } from 'renderer/store/store';
import { CURRENCY_FORMAT } from 'renderer/utils/adapters';

interface EmployeeCardProps {
  id: string;
  name: string;
  templateId: string;
  onClick: () => void;
}

export default function EmployeeCard({
  id,
  name,
  templateId,
  onClick,
}: EmployeeCardProps) {
  const { result: payroll } = useOnePayrollStore(`${id}-${templateId}`);
  return (
    <Card variant="outlined">
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          Resumen de horas de
        </Typography>
        <Typography variant="h5" component="div">
          {name} {payroll ? <DoneIcon color="success" /> : ''}
        </Typography>
        <div>
          Horas comun: {payroll?.total_common_hours}
          <br />
          Horas festivo: {payroll?.total_holiday_hours}
          <Divider sx={{ mt: 2 }} /> Pago Total:{' '}
          {currency(payroll?.payment_amount, CURRENCY_FORMAT).format()}
        </div>
      </CardContent>
      <CardActions>
        <Button
          color={payroll ? 'success' : 'primary'}
          onClick={onClick}
          size="small"
          endIcon={<AccessAlarmsIcon />}
        >
          {payroll ? 'Modificar' : 'Diligenciar'} Horas
        </Button>
      </CardActions>
    </Card>
  );
}
