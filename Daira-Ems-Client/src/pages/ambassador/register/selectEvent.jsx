import React, { useState, useEffect } from 'react';
import { Box, Grid, Typography } from '@mui/material';
import DropdownTextField from './component/dropdown';
import { useRegistration } from '../../../service/registerationService';

const SelectEvent = ({ onChange, values }) => {
  const [categories, setCategories] = useState([]);
  const [events, setEvents] = useState([]);
  const { getEventCategoies, getEventsByCategory } = useRegistration();
  
  useEffect(() => {
    const fetchCategories = async () => {
      setEvents([]);
      const userData = JSON.parse(localStorage.getItem('userData'));
      const tokenData = userData.data;
      const token = tokenData.token;
      const categories = await getEventCategoies(token);
      setCategories(categories);
    };
    fetchCategories();
  }, []);
  
  const fetchEvents = async (category) => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    const tokenData = userData.data;
    const token = tokenData.token;
    if (category) {
      const events = await getEventsByCategory(token, category);
      setEvents(events);
    }
  };
  
  const handleCategoryChange = (event) => {
    setEvents([]);
    fetchEvents(event.target.value);
    onChange('category', event.target.value);
    // Reset event selection when category changes
    onChange('event', '');
  };
  
  const handleEventChange = (event) => {
    onChange('event', event.target.value);
  };
  
  // Check if category is selected
  const isCategorySelected = Boolean(values.category);
  
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
      }}
    >
      <Typography
        variant="body1"
        sx={{
          fontWeight: 'bold',
          marginBottom: 1,
        }}
      >
        Select Event
      </Typography>
      
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Typography variant="body2">Category</Typography>
          <DropdownTextField
            name="category"
            value={values.category || ''}
            onChange={handleCategoryChange}
            options={categories.map((category) => ({
              value: category,
              label: category,
            }))}
            placeholder="Select Category"
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="body2">Event</Typography>
          <DropdownTextField
            name="event"
            value={values.event || ''}
            onChange={handleEventChange}
            options={events.map((event) => ({
              value: event.eventName,
              label: event.eventName,
            }))}
            placeholder={isCategorySelected ? "Select Event" : "Please select a category first"}
            disabled={!isCategorySelected}
            fullWidth
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default SelectEvent;