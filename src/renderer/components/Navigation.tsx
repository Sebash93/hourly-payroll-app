import { Box, Breadcrumbs, Button, Typography } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';

const getPaths = (currentPath) => {
  const paths = currentPath.split('/');
  if (paths.length > 1) {
    const id = paths.pop();
    return paths.map((path: string) => {
      if (path === 'payroll') {
        return {
          url: `payroll/${id}`,
          name: 'Horas',
        };
      }
      if (path === 'documents') {
        return {
          url: `payroll/documents/${id}`,
          name: 'Documentos',
        };
      }
      return null;
    });
  }

  return [];
};

export default function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const paths = getPaths(location.pathname);

  function handleNavigate(route: string) {
    navigate(route);
  }

  return (
    <Box
      sx={{
        p: 3,
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
      }}
    >
      <Typography variant="h5" component="div" sx={{ mr: 3 }}>
        Nomina Línea GM
      </Typography>
      <Breadcrumbs sx={{ flexGrow: 1 }} aria-label="breadcrumb">
        <Button variant="text" onClick={() => navigate('/')}>
          Planillas
        </Button>
        {paths?.map((path) =>
          path ? (
            <Button variant="text" onClick={() => navigate(path.url)}>
              {path.name}
            </Button>
          ) : (
            ''
          )
        )}
      </Breadcrumbs>
    </Box>
  );
}
