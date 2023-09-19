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
import { useEffect, useState } from 'react';
import { COLLECTION, PayrollCollection } from 'renderer/db/db';
import { CURRENCY_FORMAT } from 'renderer/utils/adapters';
import { useRxData } from 'rxdb-hooks';

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
  const { result: payroll, isFetching } = useRxData<PayrollCollection>(
    COLLECTION.PAYROLL,
    (collection) =>
      collection.findOne({
        selector: { id: `${id}-${templateId}` },
      })
  );

  const [payrollData, setPayrollData] = useState<PayrollCollection>(null);

  useEffect(() => {
    if (payroll?.length) {
      setPayrollData(payroll[0]);
    }
  }, [payroll]);

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          Resumen de horas de
        </Typography>
        <Typography variant="h5" component="div">
          {name} {payrollData ? <DoneIcon color="success" /> : ''}
        </Typography>
        <div>
          Horas comun: {payrollData?.total_common_hours}
          <br />
          Horas festivo: {payrollData?.total_common_hours}
          <Divider sx={{ mt: 2 }} /> Pago Total:{' '}
          {currency(payrollData?.payment_amount, CURRENCY_FORMAT).format()}
        </div>
      </CardContent>
      <CardActions>
        <Button
          color={payrollData ? 'success' : 'primary'}
          onClick={onClick}
          size="small"
          endIcon={<AccessAlarmsIcon />}
        >
          {payrollData ? 'Modificar' : 'Diligenciar'} Horas
        </Button>
      </CardActions>
    </Card>
  );
}
