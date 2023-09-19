import { Box, Grid, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { COLLECTION, TemplateCollection } from 'renderer/db/db';
import { useRxData } from 'rxdb-hooks';
import TemplateItem from './TemplateItem';

export default function TemplateView({ employees }) {
  const { result: templates, isFetching } = useRxData<TemplateCollection>(
    COLLECTION.TEMPLATE,
    (collection) => collection.find({})
  );

  const navigate = useNavigate();

  const handlePayrollClick = (id: string) => {
    navigate(`/payroll/${id}`);
  };

  const handleDocumentsClick = (id: string) => {
    navigate(`payroll/${id}/documents`);
  };

  return (
    <Box sx={{ marginBottom: '24px' }}>
      <Typography variant="h4" sx={{ p: 2 }}>
        Planillas
      </Typography>
      <Grid container spacing={4}>
        {templates.map((template) => (
          <Grid key={template.id} item lg={3} md={4} sm={6} xs={12}>
            <TemplateItem
              data={template}
              employeesIds={template.employees}
              employeesData={employees}
              onPrint={handleDocumentsClick}
              onDelete={() => {}}
              onPayrollClick={handlePayrollClick}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
