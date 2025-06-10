import { Box, Grid } from '@mui/material';
import React, { useEffect, useState } from 'react';
import LoginComponent from './components/loginPage';
import Logo from '../../../images/Daira 2025 (Dark).png';

const Login = () => {
  return (
    <Grid container sx={{ height: '100vh' }}>
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          backgroundColor: 'black',
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
            maxWidth: '70%',
            maxHeight: '70%',
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

export default Login;
