import { Box, Grid, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAugmentedTemplateStore } from 'renderer/store/store';
import TemplateItem from './TemplateItem';

export default function TemplateView() {
  const { result: templatesAugmentedData } = useAugmentedTemplateStore();

  const navigate = useNavigate();

  const handlePayrollClick = (id: string) => {
    navigate(`/payroll/${id}`);
  };

  const handleDocumentsClick = (id: string) => {
    navigate(`payroll/documents/${id}`);
  };

  return (
    <Box sx={{ marginBottom: '24px' }}>
      <Typography variant="h4" sx={{ p: 2 }}>
        Planillas
      </Typography>
      <Grid container spacing={4}>
        {templatesAugmentedData.map((template, index) => (
          <Grid key={template.id} item lg={3} md={4} sm={6} xs={12}>
            <TemplateItem
              index={index}
              data={template}
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
