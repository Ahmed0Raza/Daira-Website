import React, { useState } from 'react';
import { Box, Button, TextField } from '@mui/material';

const HeaderFieldsTeam = ({ masterData, setData }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    // If searchTerm is empty, show all data.
    if (!searchTerm) {
      setData(masterData);
      return;
    }
    // Filter the masterData based on team names.
    const filtered = masterData.filter((item) => {
      // Ensure item.teamApproved is an array.
      if (Array.isArray(item.teamApproved)) {
        // Check if any team name contains the search term (case-insensitive).
        return item.teamApproved.some((team) =>
          team.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      return false;
    });
    setData(filtered);
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
        label="Search by Team Name"
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

export default HeaderFieldsTeam;
