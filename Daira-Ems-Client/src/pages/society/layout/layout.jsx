import React from 'react';
import { Box, Grid } from '@mui/material';
import Navbar from '../../../components/society/navbar/navbar';
import Sidebar from '../../../components/society/sidebar/sidebar';
import { Outlet } from 'react-router-dom';

const SocietyLayout = () => {
  return (
    <Box sx={{ position: 'relative', flexGrow: 1 }}>
      <Grid container item>
        <Grid item md={2} sx={{ zIndex: 6 }}>
          <Sidebar />
        </Grid>
        <Grid
          item
          md={10}
          xs={12}
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
          }}
        >
          <Box sx={{ flexGrow: 0, zIndex: 5 }}>
            <Navbar />
          </Box>
          <Box
            sx={{
              flexGrow: 1,
              overflowY: 'auto',
              padding: '10px',
              marginTop: '64px',
            }}
          >
            <Outlet />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SocietyLayout;
