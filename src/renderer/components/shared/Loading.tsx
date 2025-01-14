import { CircularProgress, Container } from '@mui/material';

export default function Loading() {
  return (
    <Container
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '300px',
      }}
    >
      <CircularProgress />
    </Container>
  );
}
