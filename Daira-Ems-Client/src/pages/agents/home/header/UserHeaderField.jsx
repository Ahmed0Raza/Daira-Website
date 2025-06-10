import React, { useState } from 'react';
import { Box, Button, TextField } from '@mui/material';

const UserHeaderField = ({ setSearch }) => {
  const [searchInput, setSearchInput] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput.trim().toLowerCase());
  };

  const handleClear = () => {
    setSearch('');
    setSearchInput('');
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 2 }}>
      <TextField
        label="Search by Email"
        variant="outlined"
        fullWidth
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
      />
      <Button
        variant="contained"
        onClick={handleSearch}
        sx={{ backgroundColor: '#ffc107', color: '#000' }}
      >
        Search
      </Button>
      <Button variant="outlined" onClick={handleClear}>
        Clear
      </Button>
    </Box>
  );
};

export default UserHeaderField;
