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
  COLLECTION,
  EmployeeCollection,
  PayrollCollection,
} from 'renderer/db/db';
import { print } from 'renderer/utils/files';
import { useRxData } from 'rxdb-hooks';

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
  const [template, setTemplate] = useState(false);
  const { result: payroll, isFetching } = useRxData<PayrollCollection>(
    COLLECTION.PAYROLL,
    (collection) =>
      collection.find({
        selector: { templateId },
      })
  );

  const { result: employees, isFetchingEmployees } =
    useRxData<EmployeeCollection>(COLLECTION.EMPLOYEE, (collection) =>
      collection.find({})
    );

  const { result: templates, isFetchingTemplate } =
    useRxData<TemplateCollection>(COLLECTION.TEMPLATE, (collection) =>
      collection.findOne({ selector: { id: templateId } })
    );

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
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
          >
            <Tab label="Resumen" />
            <Tab label="Comprobantes de pago" />
            <Tab label="Respaldo" />
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
          {payroll.map((employeePayroll) => (
            <PayrollReceipt payroll={employeePayroll} />
          ))}
        </CustomTabPanel>
        <CustomTabPanel value={value} index={2}>
          Item Three
        </CustomTabPanel>
      </Paper>
    </>
  );
}
