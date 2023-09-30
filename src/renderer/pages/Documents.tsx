import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  Paper,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import { ReactNode, SyntheticEvent, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PayrollReceipt from 'renderer/components/PayrollReceipt';
import SummaryTable from 'renderer/components/SummaryTable';
import {
  useEmployeeStore,
  useOneTemplateStore,
  usePayrollStore,
} from 'renderer/store/store';
import { print } from 'renderer/utils/files';
import { PayrollWithEmployees } from 'renderer/utils/types';

interface TabPanelProps {
  children: ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

export default function DocumentsPage() {
  let { templateId } = useParams();
  const [value, setValue] = useState(0);
  const [template, setTemplate] = useState(null);
  const [payrollTotal, setPayrollTotal] = useState(0);
  const [payrollWithEmployees, setPayrollWithEmployees] =
    useState<PayrollWithEmployees[]>();
  const { result: payroll, isFetching } = usePayrollStore(templateId);

  const { result: employees, isFetching: isFetchingEmployees } =
    useEmployeeStore();

  const { result: templates, isFetching: isFetchingTemplate } =
    useOneTemplateStore(templateId);

  useEffect(() => {
    if (!payroll?.length || !employees?.length) return;
    let newTotal = 0;
    const newPayroll = payroll.map((payrollItem) => {
      const employeeInfo = employees.find(
        (employee) => employee.id === payrollItem.employeeId
      );
      newTotal += payrollItem.payment_amount;
      return {
        ...payrollItem._data,
        employee: employeeInfo,
      };
    });
    setPayrollTotal(newTotal);
    setPayrollWithEmployees(newPayroll);
  }, [payroll, employees]);

  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  useEffect(() => {
    if (templates?.length) {
      setTemplate(templates[0]);
    }
  }, [templates]);

  if (!template) {
    return <CircularProgress />;
  }

  return (
    <>
      <Typography variant="h4" sx={{ p: 2 }}>
        Documentos
      </Typography>
      <Paper>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value} onChange={handleChange}>
            <Tab label="Resumen" />
            <Tab label="Comprobantes de pago" />
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0}>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Typography
                variant="h5"
                sx={{ display: 'flex', justifyContent: 'space-between' }}
              >
                Resumen
                <Button
                  variant="contained"
                  onClick={() => print('table-toprint')}
                  endIcon={<LocalPrintshopIcon />}
                >
                  Imprimir
                </Button>
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <SummaryTable
                payrollData={payroll}
                employeesData={employees}
                templateData={template}
              />
            </Grid>
          </Grid>
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Typography
                variant="h5"
                sx={{ display: 'flex', justifyContent: 'space-between' }}
              >
                Comprobantes de pago
                <Button
                  variant="contained"
                  onClick={() => print('table-toprint')}
                  endIcon={<LocalPrintshopIcon />}
                >
                  Imprimir
                </Button>
              </Typography>
            </Grid>
            <Grid item xs={12} className="printable">
              {payrollWithEmployees?.map((employeePayroll) => (
                <PayrollReceipt
                  employeePayroll={employeePayroll}
                  template={template}
                />
              ))}
            </Grid>
          </Grid>
        </CustomTabPanel>
      </Paper>
    </>
  );
}
