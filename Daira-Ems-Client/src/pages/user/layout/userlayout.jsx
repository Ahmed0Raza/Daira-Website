import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { Header } from '../../../components/Header';
import Footer from '../../../components/Footer';
import { useTheme } from '@emotion/react';

export default function UserLayout() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
      }}
    >
      <Box
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          height: '0px',
        }}
      >
        <Header />
      </Box>
      <Box
        sx={{
          flex: 1,
          backgroundColor: theme.palette.background.default,
        }}
      >
        <Outlet />
      </Box>
      <Box>
        <Footer />
      </Box>
    </Box>
  );
}
