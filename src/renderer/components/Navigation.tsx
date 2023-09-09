import {
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PostAddIcon from '@mui/icons-material/PostAdd';
import { useNavigate } from 'react-router-dom';

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
    route: '/payroll',
  },
];

export default function Navigation() {
  const navigate = useNavigate();

  function handleNavigate(route: string) {
    navigate(route);
  }

  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
      variant="permanent"
      anchor="left"
    >
      <Toolbar>
        <h3>Sistema de Nómina Linea GM</h3>
      </Toolbar>
      <Divider />
      <List>
        {MenuData.map(({ name, icon, route }) => (
          <ListItem key={name} disablePadding>
            <ListItemButton onClick={() => handleNavigate(route)}>
              <ListItemIcon>{icon}</ListItemIcon>
              <ListItemText primary={name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}
