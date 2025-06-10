import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
  const navigate = useNavigate();

  const goBack = () => navigate(-1); // Go back to the previous page
  const goHome = () => navigate('/home'); // Go to the home page

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        gap: 2,
      }}
    >
      <Typography variant="h1" sx={{ fontSize: '5rem' }}>
        404
      </Typography>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Oops! We can't seem to find the page you're looking for.
      </Typography>
      <Box>
        <Button variant="contained" sx={{ mr: 1 }} onClick={goBack}>
          Go Back
        </Button>
        <Button variant="outlined" onClick={goHome}>
          Home
        </Button>
      </Box>
    </Box>
  );
};

export default NotFoundPage;
