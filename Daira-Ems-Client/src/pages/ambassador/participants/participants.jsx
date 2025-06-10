import React from 'react';
import { Box, Grid } from '@mui/material';
import Participants from './index';
import AddParticipant from './modal/addParticipant';
import { useRegistration } from '../../../service/registerationService';
import Spinner from '../../../utils/spinner';

const ManageParticipants = () => {
  const { loading } = useRegistration();

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <Spinner />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        padding: 2,
      }}
    >

<Grid item xs={12}>
          <AddParticipant />
        </Grid>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Participants />
        </Grid>

        
      </Grid>
    </Box>
  );
};

export default ManageParticipants;
