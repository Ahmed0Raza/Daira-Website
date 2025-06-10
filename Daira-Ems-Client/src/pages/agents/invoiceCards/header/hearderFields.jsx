import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  Grid,
  Typography,
  TextField,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';
import { useRegistrationAgent } from '../../../../service/registrationAgentService';

function HeaderFields({ setData }) {
  const { getUserInvoices } = useRegistrationAgent();
  const [formData, setFormData] = useState({
    search: '',
    searchBy: 'email',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const onSearch = async () => {
    const data = {};

    if (formData.searchBy === 'email') {
      data.email = formData.search;
      data.cnic = '';
    } else if (formData.searchBy === 'cnic') {
      data.cnic = formData.search;
      data.email = '';
    } else {
      console.log('Invalid searchBy type');
    }

    const userData = JSON.parse(localStorage.getItem('agentData'));
    if (!data.email && !data.cnic) return;
    const { invoices } = await getUserInvoices(userData.result, data);
    setData(invoices);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        p: 2,
      }}
    >
      <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: 500 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Typography sx={{ mr: 2, fontWeight: 'bold' }}>Criteria</Typography>
          <FormControl fullWidth>
            <TextField
              select
              fullWidth
              name="searchBy"
              value={formData.searchBy}
              onChange={handleChange}
              variant="outlined"
              SelectProps={{
                native: true,
              }}
            >
              <option value="email">Email</option>
              <option value="cnic">CNIC</option>
            </TextField>
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
              height: '56px',
              '&:hover': {
                backgroundColor: '#E0A800',
              },
            }}
          >
            Search
          </Button>
        </Box>
      </form>
    </Box>
  );
}

export default HeaderFields;