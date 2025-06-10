import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';

const Navbar = () => {
  const [name, setName] = useState('');
  useEffect(() => {
    const userData = localStorage.getItem('agentData');
    if (userData) {
      const parsedData = JSON.parse(userData);
      setName(parsedData.name);
    }
  }, []);

  return (
    <Box
      sx={{
        right: 0,
        position: 'fixed',
        width: '100%',
        display: 'flex',
        justifyContent: 'flex-end',
        padding: 2,
        borderBottom: 1,
        borderColor: 'divider',
        borderStyle: 'solid',
        backgroundColor: 'background.paper',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
          gap: 1,
          backgroundColor: 'grey.200',
          padding: 1,
          borderRadius: 1,
          fontSize: 20,
        }}
        onClick={() => {
          // console.log('Clicked');
        }}
      >
        <span className="text-[#fc8b00] font-bold">Welcome {name}</span>
      </Box>
    </Box>
  );
};

export default Navbar;
