import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import InvoiceModal from './modal/invoiceModal';
import Spinner from '../../../utils/spinner';
import HeaderFields from './header/hearderFields';

function RegisterationPage() {
  const [data, setData] = useState([]);
   
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
      }}
    >
      {console.log(data)}
      <HeaderFields setData={setData} />
      <InvoiceModal invoiceData={data} />
    </Box>
  );
}
export default RegisterationPage;
