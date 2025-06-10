import { Box, Grid } from '@mui/material';
import React, { useEffect, useState } from 'react';
import LoginComponent from './components/loginPage';
import Logo from '../../../resources/Horizontal-Tagline.png';
// import Tagline from '../../../resources/Tagline.png';
// import Logo from '../../../resources/Horizontal-Tagline.png';
const AdminLogin = () => {
  return (
    <Grid container sx={{ height: '100vh' }}>
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          backgroundColor: '#1f2120',
          height: { xs: '30%', md: '100%' },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <img
          src={Logo}
          alt="Group"
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain',
          }}
        />
        {/* <img
          src={Tagline}
          alt="Group"
          style={{
            height: '20%',
            width: '50%',
            objectFit: 'cover',
          }} 
        />*/}
      </Grid>
      <Grid
        item
        xs={12}
        md={6}
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <LoginComponent />
      </Grid>
    </Grid>
  );
};

export default AdminLogin;
