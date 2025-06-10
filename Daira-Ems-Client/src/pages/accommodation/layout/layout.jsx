import React from 'react';
import Sidebar from '../../../components/accommodation/sidebar/sidebar';
import { Outlet } from 'react-router-dom';
import { Box, Grid } from '@mui/material';

const RegistrationAgentLayout = () => {
  return (
    <Box sx={{ position: 'relative', flexGrow: 1 }}>
      <Grid container>
      <Grid item md={3} xs={12} sx={{ zIndex: 6 }}>
          <Sidebar />
        </Grid>
        <Grid
          item
          md={9}
          xs={12}
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            // justifyContent: 'center',
            height: '100vh',
          }}
        >
          {/* <Box sx={{ flexGrow: 0, zIndex: 5 }}>
            <Navbar />
          </Box> */}
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

export default RegistrationAgentLayout;
