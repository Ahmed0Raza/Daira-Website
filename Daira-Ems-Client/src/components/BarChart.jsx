import React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { axisClasses } from '@mui/x-charts/ChartsAxis';
import { Box, Typography, useMediaQuery } from '@mui/material';

const valueFormatter = (value) => `${value}`;

const chartSetting = {
  yAxis: [
    {
      label: 'Participants',
    },
  ],
  series: [{ dataKey: 'participants', color: '#ffc107', valueFormatter }],
  sx: {
    [`& .${axisClasses.directionY} .${axisClasses.label}`]: {
      transform: 'translateX(-10px)',
    },
  },
};

const TickPlacementBars = ({ dataset }) => {
  if (!dataset || !dataset.participantsByDay) {
    return (
      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        <Typography
          sx={{
            fontSize: '24px',
            textAlign: 'center',
            marginBottom: '16px',
          }}
        >
          No data available
        </Typography>
      </Box>
    );
  }

  // Convert the incoming dataset to the required format
  const formattedDataset = Object.entries(dataset.participantsByDay).map(
    ([date, participants]) => {
      let formattedDate = date === 'Invalid Date' ? 'Thu Apr 17 2024' : date;
      const parsedDate = new Date(formattedDate);
      const monthDay = `${parsedDate.toLocaleString('en-US', { month: 'short' })}-${parsedDate.getDate().toString().padStart(2, '0')}`;
      return { month: monthDay, participants };
    }
  );

  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  return (
    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
      <Box sx={{ width: '100%', maxWidth: '800px' }}>
        <Typography
          sx={{
            fontSize: '24px',
            textAlign: 'center',
            marginBottom: '16px',
          }}
        >
          Participants by Day
        </Typography>
        <BarChart
          dataset={formattedDataset}
          xAxis={[
            {
              scaleType: 'band',
              dataKey: 'month',
            },
          ]}
          {...chartSetting}
          width={isSmallScreen ? 400 : 800}
          height={isSmallScreen ? 300 : 300}
        />
      </Box>
    </Box>
  );
};

export default TickPlacementBars;
