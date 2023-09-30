import { Typography } from '@mui/material';
import { Dispatch } from 'react';
import Loading from 'renderer/components/shared/Loading';
import TemplateNew from 'renderer/components/template/TemplateNew';
import TemplateView from 'renderer/components/template/TemplateView';
import { SnackbarAction } from 'renderer/store/snackbar';
import { useEmployeeStore } from 'renderer/store/store';

export default function TemplatePage({
  snackbarDispatcher,
}: {
  snackbarDispatcher: Dispatch<SnackbarAction>;
}) {
  const { result: employees, isFetching } = useEmployeeStore();

  if (isFetching) {
    return <Loading />;
  }
  return (
    <>
      <Typography variant="h4" sx={{ p: 2 }}>
        Planillas
      </Typography>
      <TemplateView />
      <TemplateNew
        employees={employees}
        snackbarDispatcher={snackbarDispatcher}
      />
    </>
  );
}
