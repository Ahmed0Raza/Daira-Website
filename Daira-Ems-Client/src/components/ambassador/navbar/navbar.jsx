import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';

const Navbar = () => {
  const [name, setName] = useState('');
  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (userData) {
      const parsedData = JSON.parse(userData);
      setName(parsedData.data.result.name);
    }
  }, []);

  return (
    <Box
      sx={{
        position: 'fixed',
        right: 0,
        width: '100%',
        display: 'flex',
        justifyContent: 'flex-end',
        px: 1,
        py: 1,
        borderBottom: 1,
        borderColor: 'divider',
        borderStyle: 'solid',
        backgroundColor: 'background.paper',
        minHeight: '40px',
        zIndex: 9999,
        margin: 0,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
          gap: 1,
          p: 1,
          borderRadius: 1,
          fontWeight: 'bold',
          color: '#50149F',
          fontFamily: '"Poppins", sans-serif',
          fontSize: name.length > 10 ? { xs: 14, md: 18 } : { xs: 18, md: 20 },
          maxWidth: '80%',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
        }}
      >
        <span>Welcome {name}</span>
      </Box>
    </Box>
  );
};

export default Navbar;
