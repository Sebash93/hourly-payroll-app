import { useEffect, useState } from 'react';
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

export default function App() {
  const [db, setDb] = useState<any>();

  useEffect(() => {
    // RxDB instantiation can be asynchronous
    initialize()
      .then(setDb)
      .catch((err) => console.error(err));
  }, []);
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
                sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}
              >
                <Routes>
                  <Route path="/template" element={<TemplatePage />} />
                </Routes>
              </Box>
            </Box>
          </RxDbProvider>
        </ThemeProvider>
      </LocalizationProvider>
    </Router>
  );
}
