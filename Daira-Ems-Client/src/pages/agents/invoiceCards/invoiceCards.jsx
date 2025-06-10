import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import Spinner from '../../../utils/spinner';
import HeaderFields from './header/hearderFields';
import Invoice from './modal/invoice';
function invoiceCards() {
  const [data, setData] = useState([]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
      }}
    >
      <HeaderFields setData={setData} />
      <Invoice searchData={data} />
    </Box>
  );
}
export default invoiceCards;
