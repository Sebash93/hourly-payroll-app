import { Box, CssBaseline, ThemeProvider } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { setDefaultOptions } from 'date-fns';
import es from 'date-fns/locale/es';
import { useEffect, useReducer, useState } from 'react';
import { Route, MemoryRouter as Router, Routes } from 'react-router-dom';
import { Provider as RxDbProvider } from 'rxdb-hooks';
import './App.css';
import DocumentsPage from './components/documents/Documents';
import PayrollPage from './components/payroll/Payroll';
import Global from './components/shared/Global';
import Navigation from './components/shared/Navigation';
import TemplatePage from './components/template/Template';
import initialize from './db';
import './print.css';
import { ROUTES, RoutePath } from './routes';
import snackbarReducer, { snackbarInitialState } from './store/snackbar';
import theme from './theme/theme';

export default function App() {
  const [db, setDb] = useState<any>();

  useEffect(() => {
    // Config dateFns
    setDefaultOptions({ locale: es });
    // RxDB instantiation can be asynchronous
    initialize()
      .then(setDb)
      .catch((err) => console.error(err));
  }, []);

  const [snackbarState, snackbarDispatcher] = useReducer(
    snackbarReducer,
    snackbarInitialState
  );
  return (
    <Router>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <ThemeProvider theme={theme}>
          <RxDbProvider db={db}>
            <Box>
              <Navigation />
              <Box
                component="main"
                sx={{
                  flexGrow: 1,
                  minHeight: '100vh',
                  bgcolor: 'background.default',
                  p: 3,
                }}
              >
                <Routes>
                  <Route
                    path={RoutePath[ROUTES.ROOT]}
                    element={
                      <TemplatePage snackbarDispatcher={snackbarDispatcher} />
                    }
                  />
                  <Route
                    path={RoutePath[ROUTES.PAYROLL]}
                    element={<PayrollPage />}
                  />
                  <Route
                    path={RoutePath[ROUTES.DOCUMENTS]}
                    element={<DocumentsPage />}
                  />
                </Routes>
                <Global
                  snackbar={snackbarState}
                  snackbarDispatcher={snackbarDispatcher}
                />
              </Box>
            </Box>
          </RxDbProvider>
        </ThemeProvider>
        <iframe
          src="./print.html"
          name="print_frame"
          title="print_frame"
          width="0"
          height="0"
        />
      </LocalizationProvider>
    </Router>
  );
}
