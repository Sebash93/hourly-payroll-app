import { Box, Paper, Tab, Tabs, Typography } from '@mui/material';
import { SyntheticEvent, useState } from 'react';
import { useParams } from 'react-router-dom';
import PayrollReceipt from 'renderer/components/documents/PayrollReceipt';
import SummaryTable from 'renderer/components/documents/SummaryTable';
import {
  useAugmentedPayrollStore,
  useOneTemplateStore,
} from 'renderer/store/store';
import Loading from '../shared/Loading';
import TabPanel from './TabPanel';

export default function DocumentsPage() {
  const { templateId } = useParams();
  const [value, setValue] = useState(0);

  const { result: template, isFetching: isFetchingTemplate } =
    useOneTemplateStore(templateId);

  const { result: augementedPayroll, isFetching: isFetchingAugmentedPayroll } =
    useAugmentedPayrollStore(templateId as string);

  const handleTabChange = (event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  if (isFetchingTemplate || isFetchingAugmentedPayroll) {
    return <Loading />;
  }

  return (
    <>
      <Typography variant="h4" sx={{ p: 2 }}>
        Documentos
      </Typography>
      <Paper>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value} onChange={handleTabChange}>
            <Tab label="Resumen" />
            <Tab label="Comprobantes de pago" />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0} title="Resumen">
          <SummaryTable
            templateData={template}
            augementedPayrollData={augementedPayroll}
          />
        </TabPanel>
        <TabPanel value={value} index={1} title="Comprobantes de Pago">
          {augementedPayroll?.map((employeePayroll) => (
            <PayrollReceipt
              template={template}
              key={employeePayroll.id}
              employeePayroll={employeePayroll}
            />
          ))}
        </TabPanel>
      </Paper>
    </>
  );
}
