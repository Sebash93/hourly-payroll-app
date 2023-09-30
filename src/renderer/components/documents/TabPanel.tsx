import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';
import { Box, Button, Grid, Typography } from '@mui/material';
import { ReactNode } from 'react';

interface TabPanelProps {
  children: ReactNode;
  index: number;
  value: number;
  title: string;
}

export default function TabPanel(props: TabPanelProps) {
  const { children, value, index, title } = props;

  const handlePrint = () => {
    window.print();
  };
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Typography
                variant="h5"
                sx={{ display: 'flex', justifyContent: 'space-between' }}
              >
                {title}
                <Button
                  variant="contained"
                  onClick={handlePrint}
                  endIcon={<LocalPrintshopIcon />}
                >
                  Imprimir
                </Button>
              </Typography>
            </Grid>
            <Grid item xs={12} className="printable">
              {children}
            </Grid>
          </Grid>
        </Box>
      )}
    </div>
  );
}
