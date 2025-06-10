import { Box, Grid, CircularProgress } from '@mui/material';
import React, { useState } from 'react';
import Logo from '../../../images/Daira 2025 (Dark).png';
import SignupComponent from './components/signupPage1';
import SignupComponent2 from './components/signupPage2';
import ConfirmationNode from './components/confirmationNode';

const Signup = () => {
  const [formState, setFormState] = useState(1);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  const nextStep = (withDelay = false) => {
    if (withDelay) {
      setLoading(true);
      setTimeout(() => {
        setFormState(formState + 1);
        setLoading(false);
      }, 1000); // Simulate delay for loader
    } else {
      setFormState(formState + 1);
    }
  };

  const prevStep = () => {
    setFormState(formState - 1);
  };

  let formContent;
  switch (formState) {
    case 1:
      formContent = (
        <SignupComponent
          nextStep={nextStep}
          setFormData={setFormData}
          formData={formData}
        />
      );
      break;
    case 2:
      formContent = (
        <SignupComponent2
          nextStep={nextStep}
          prevStep={prevStep}
          setFormData={setFormData}
          formData={formData}
        />
      );
      break;
    case 3:
      formContent = loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="100%">
          <CircularProgress color="primary" />
        </Box>
      ) : (
        <ConfirmationNode />
      );
      break;
    default:
      formContent = <SignupComponent nextStep={nextStep} />;
  }

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
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain',
          }}
        />
      </Grid>
      <Grid
        item
        xs={12}
        md={6}
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        {formContent}
      </Grid>
    </Grid>
  );
};

export default Signup;
