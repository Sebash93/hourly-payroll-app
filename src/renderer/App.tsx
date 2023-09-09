import { useEffect, useReducer, useState } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider as RxDbProvider } from 'rxdb-hooks';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { Box, CssBaseline, ThemeProvider } from '@mui/material';
import Navigation from './components/Navigation';
import TemplatePage from './pages/Template';
import './App.css';
import theme from './theme/theme';
import initialize from './db/db';
import Global from './components/Global';
import snackbarReducer, { snackbarInitialState } from './store/snackbar';

export default function App() {
  const [db, setDb] = useState<any>();

  useEffect(() => {
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
            <Box sx={{ display: 'flex' }}>
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
                    path="/template"
                    element={
                      <TemplatePage snackbarDispatcher={snackbarDispatcher} />
                    }
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
      </LocalizationProvider>
    </Router>
  );
}
