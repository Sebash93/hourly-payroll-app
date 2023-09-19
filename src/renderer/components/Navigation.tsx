import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PostAddIcon from '@mui/icons-material/PostAdd';
import { Box, Breadcrumbs, Link, Typography } from '@mui/material';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

const drawerWidth = 180;

const MenuData = [
  {
    name: 'Plantilla',
    icon: <PostAddIcon />,
    route: '/template',
  },
  {
    name: 'Nómina',
    icon: <AccessTimeIcon />,
    route: '/payroll/:templateId',
  },
  {
    name: 'Documentos',
    icon: <AccessTimeIcon />,
    route: '/documents/:templateId',
  },
];

const getPathsWithRoutes = (path, templateId) => {
  const paths = path.split('/');
  return paths.map((currentPath) => {
    if (currentPath === 'payroll') {
      return {
        name: 'Nómina',
        url: `/payroll/${templateId}`,
      };
    }
    if (currentPath === 'documents') {
      return {
        name: 'Documentos',
        url: `/payroll/${templateId}/documents`,
      };
    }
    return '';
  });
};

export default function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { templateId } = useParams();
  const paths = getPathsWithRoutes(location.pathname, templateId);

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
        <Link underline="hover" color="inherit" href="/">
          Planillas
        </Link>
        {paths.map((path) => {
          if (path === '') {
            return '';
          }
          return (
            <Link
              key={path.name}
              underline="hover"
              color="inherit"
              href={path.url}
            >
              {path.name}
            </Link>
          );
        })}
      </Breadcrumbs>
    </Box>
  );
}
