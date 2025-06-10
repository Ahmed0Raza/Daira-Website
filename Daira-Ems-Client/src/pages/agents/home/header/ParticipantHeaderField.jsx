import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  TextField,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';

const ParticipantHeaderField = ({ setSearch }) => {
  const [formData, setFormData] = useState({
    searchBy: 'name',
    search: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (formData.searchBy === 'name') {
      setSearch({ name: formData.search.trim().toLowerCase(), cnic: '' });
    } else if (formData.searchBy === 'cnic') {
      setSearch({ name: '', cnic: formData.search.trim().toLowerCase() });
    }
  };

  const handleClear = () => {
    setFormData({ searchBy: 'name', search: '' });
    setSearch({ name: '', cnic: '' });
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        mb: 2,
        gap: 2,
      }}
    >
      <form onSubmit={handleSearch} style={{ width: '100%', maxWidth: 500 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Typography sx={{ mr: 2, fontWeight: 'bold' }}>Criteria</Typography>
          <FormControl fullWidth>
            <InputLabel id="searchBy-label">Search By</InputLabel>
            <Select
              labelId="searchBy-label"
              name="searchBy"
              value={formData.searchBy}
              onChange={handleChange}
              label="Search By"
            >
              <MenuItem value="name">Name</MenuItem>
              <MenuItem value="cnic">CNIC</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <TextField
            fullWidth
            placeholder="Search"
            name="search"
            value={formData.search}
            onChange={handleChange}
            sx={{ mr: 2 }}
          />
          <Button
            type="submit"
            variant="contained"
            sx={{
              backgroundColor: '#FFC107',
              color: '#000',
              height: '40px',
              width: '90px',
              fontSize: '0.75rem',
              mr: 1.5, // margin-right for spacing
              '&:hover': {
                backgroundColor: '#E0A800',
              },
            }}
          >
            Search
          </Button>
          <Button
            variant="outlined"
            onClick={handleClear}
            sx={{
              height: '40px',
              width: '90px',
              fontSize: '0.75rem',
              minWidth: '90px',
            }}
          >
            Clear
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default ParticipantHeaderField;
