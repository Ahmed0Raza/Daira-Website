import React, { useEffect, useState } from 'react';
import {
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import { useRegistration } from '../../../service/registerationService';

const EventDetails = ({ name, invoiceRow }) => {
  const { getEventDetails } = useRegistration();
  const [description, setDescription] = useState('Select An Event');
  const [rules, setRules] = useState('Select An Event');

  useEffect(() => {
    const fetchEventDetails = async () => {
      const userData = JSON.parse(localStorage.getItem('userData'));
      const tokenData = userData.data;
      const token = tokenData.token;
      const details = await getEventDetails(token, name);
      // console.log(details);

      if (details && details.length > 0) {
        setDescription(details[0].description);
        setRules(details[0].rules);
        invoiceRow(details);
      }
    };

    fetchEventDetails();
  }, [name]);

  return (
    <Box sx={{ width: '100%' }}>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMore />}
          aria-controls="event-details-content"
          id="event-details-header"
        >
          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
            Event Details
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              width: '100%',
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
              Event Description
            </Typography>
            <Typography
              variant="body2"
              sx={{
                whiteSpace: 'pre-wrap',
                overflowWrap: 'break-word',
                overflow: 'hidden',
              }}
            >
              {description}
            </Typography>
          </Box>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMore />}
          aria-controls="event-rules-content"
          id="event-rules-header"
        >
          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
            Event Rules
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              width: '100%',
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
              Event Rules
            </Typography>
            <Typography
              variant="body2"
              sx={{
                whiteSpace: 'pre-wrap',
                overflowWrap: 'break-word',
                overflow: 'hidden',
              }}
            >
              {rules}
            </Typography>
          </Box>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default EventDetails;
