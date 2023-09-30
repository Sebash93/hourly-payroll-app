import { Box, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ROUTES, getPath } from 'renderer/routes';
import { useAugmentedTemplateStore } from 'renderer/store/store';
import TemplateItem from './TemplateItem';

export default function TemplateView() {
  const navigate = useNavigate();
  const { result: templatesAugmentedData } = useAugmentedTemplateStore();

  return (
    <Box sx={{ marginBottom: '24px' }}>
      <Grid container spacing={4}>
        {templatesAugmentedData.map((template, i) => (
          <Grid key={template.id} item lg={3} md={4} sm={6} xs={12}>
            <TemplateItem
              index={i}
              data={template}
              onDelete={() => {}}
              onPrint={() => navigate(getPath(ROUTES.DOCUMENTS, template.id))}
              onPayrollClick={() =>
                navigate(getPath(ROUTES.PAYROLL, template.id))
              }
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
