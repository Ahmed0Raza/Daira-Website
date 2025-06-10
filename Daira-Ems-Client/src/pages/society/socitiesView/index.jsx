import { Box } from '@mui/material';
import React, { useEffect, useState } from 'react';
import SocietyAnalyticsLayout from './view/table';
import { useSociety } from '../../../service/societyService';
import Spinner from '../../../utils/spinner';

const SocietiesView = () => {
  const { getRegistrationsBySociety, loading } = useSociety();
  const [data, setData] = useState([]);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('isSocietyData'));
    const token = userData.result;
    getRegistrationsBySociety(token).then((response) => {
      setData(response).catch((error) => {
        console.log(error);
      });
    });
  }, []);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        padding: 4,
        marginBottom: 2,
      }}
    >
      {loading ? (
        <Spinner />
      ) : (
        <>
          <SocietyAnalyticsLayout data={data} />
        </>
      )}
    </Box>
  );
};

export default SocietiesView;
