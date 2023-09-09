import { AlertColor } from '@mui/material';

export interface SnackbarState {
  status?: AlertColor;
  message?: string;
  show: boolean;
}

export interface SnackbarAction {
  type: string;
  payload: {
    status?: AlertColor;
    message?: string;
  };
}

export const snackbarInitialState: SnackbarState = {
  status: 'info',
  message: '',
  show: false,
};

const snackbarReducer = (state: SnackbarState, action: SnackbarAction) => {
  switch (action.type) {
    case 'SHOW_SNACKBAR':
      return {
        ...state,
        status: action.payload.status || 'info',
        message: action.payload.message,
        show: true,
      };
    case 'HIDE_SNACKBAR':
      return {
        ...state,
        show: false,
      };
    default:
      return state;
  }
};

export default snackbarReducer;
