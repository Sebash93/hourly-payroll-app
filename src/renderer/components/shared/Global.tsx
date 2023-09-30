import { Alert, AlertColor, Snackbar } from '@mui/material';
import { Dispatch } from 'react';
import { SnackbarAction, SnackbarState } from '../../store/snackbar';

export default function Global({
  snackbar,
  snackbarDispatcher,
}: {
  snackbar: SnackbarState;
  snackbarDispatcher: Dispatch<SnackbarAction>;
}) {
  const handleSnackbarClose = () => {
    snackbarDispatcher({ type: 'HIDE_SNACKBAR', payload: {} });
  };

  return (
    <Snackbar
      open={snackbar.show}
      autoHideDuration={6000}
      onClose={handleSnackbarClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert
        variant="filled"
        onClose={handleSnackbarClose}
        severity={snackbar.status as AlertColor}
        sx={{ width: '100%' }}
      >
        {snackbar.message}
      </Alert>
    </Snackbar>
  );
}
