import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, useTheme, Button } from '@mui/material';
const ConfirmationNode = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <Box
      sx={{
        p: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '90vh',
        flexDirection: 'column',
        [theme.breakpoints.down('md')]: {
          p: '10px',
          height: 'auto',
        },
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: '500px',
          [theme.breakpoints.down('sm')]: {
            p: '10px',
          },
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: '600' }} gutterBottom>
          Please Check Your Email
        </Typography>
        <Typography variant="p" gutterBottom>
          Your Signup request has been received.
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: '600' }} gutterBottom>
          Verify your email address to activate your account
        </Typography>
        <Button
          sx={{
            width: '100%',
            borderRadius: '8px',
            padding: '10px',
            backgroundColor: '#fc8b00',
            color: 'black',
            '&:hover': {
              backgroundColor: 'black',
              color: '#fc8b00',
            },
          }}
          onClick={() => navigate('/home')}
          variant="contained"
        >
          Back to Home Page
        </Button>
      </Box>
    </Box>
  );
};

export default ConfirmationNode;
