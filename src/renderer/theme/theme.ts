import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';

// Create a theme instance.
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#043565',
    },
    secondary: {
      main: '#92d5e6',
    },
    background: {
      default: '#ecf5fe',
    },
  },
  typography: {
    fontFamily: 'PT Sans',
  },
  shape: {
    borderRadius: 4,
  },
});

export default theme;
