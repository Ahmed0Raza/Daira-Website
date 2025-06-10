import React from 'react';
import { Box, Typography } from '@mui/material';

const EventDetails = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
      }}
    >
      <Typography variant="h1">Event Details</Typography>
    </Box>
  );
};

export default EventDetails;
