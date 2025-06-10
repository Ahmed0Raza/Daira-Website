import React from 'react';
import HeroSection from '../components/HeroSection';
import { Box, Grid } from '@mui/material';
import Gallery from '../components/Gallery';
import Sponser from '../components/Sponsers';
import Stats from '../components/stats';
import ScrollComponent from '../components/ScrollComponent';

export default function Home() {
  return (
    <>
      <Grid container>
        <Grid item xs={12}>
          <Box>
            <HeroSection />
          </Box>
        </Grid>
        {/* <Grid item xs={12}>
          <ScrollComponent />
        </Grid> */}
        <Grid item xs={12}>
          <Stats />
        </Grid>
        <Grid item xs={12}>
          <Gallery />
        </Grid>
        <Grid item xs={12}>
          <Box sx={{ marginBottom: '5rem' }}>
            <Sponser />
          </Box>
        </Grid>
      </Grid>
    </>
  );
}
