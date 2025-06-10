import React, { useState } from 'react';
import { Box, Button, TextField } from '@mui/material';

const HeaderFieldsAccommodation = ({ masterData, setData }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();

    if (!searchTerm) {
      setData(masterData.filter((item) => !Array.isArray(item.teamApproved) || item.teamApproved.length === 0));
      return;
    }

    const filteredData = masterData.filter((item) =>
      item.participantDetails && item.participantDetails.some((participant) => participant.cnic.includes(searchTerm))
    );
    setData(filteredData);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSearch}
      sx={{
        width: '100%',
        mb: 3,
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <TextField
        label="Search by CNIC"
        variant="outlined"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mr: 2, flex: 1 }}
      />
      <Button type="submit" variant="contained" sx={{ textTransform: 'none' }}>
        Search
      </Button>
    </Box>
  );
};

export default HeaderFieldsAccommodation;
