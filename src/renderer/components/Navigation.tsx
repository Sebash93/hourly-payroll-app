import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { Link } from 'react-router-dom';

const drawerWidth = 240;

const MenuData = [
  {
    name: 'Plantilla',
    icon: <AddCircleOutlineIcon />,
    route: '/template',
  },
  {
    name: 'Nómina',
    icon: <AccessTimeIcon />,
    route: '/payroll',
  },
];

export default function Navigation() {
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
      <List>
        {MenuData.map(({ name, icon, route }) => (
          <ListItem key={name} disablePadding>
            <Link to={route}>
              <ListItemButton>
                <ListItemIcon>{icon}</ListItemIcon>
                <ListItemText primary={name} />
              </ListItemButton>
            </Link>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}
