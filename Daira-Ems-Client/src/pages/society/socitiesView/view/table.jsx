import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import {
  Box,
  Typography,
  Card,
  Grid,
  Stack,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import GroupsIcon from '@mui/icons-material/Groups';
import EventIcon from '@mui/icons-material/Event';
import HowToRegIcon from '@mui/icons-material/HowToReg';

function aggregateEvents(data) {
  const eventCounts = {};
  let totalStats = {
    totalRegistrations: 0,
    totalParticipants: 0,
    totalTeams: 0,
    totalEvents: 0,
  };

  data.forEach((society) => {
    society.events.forEach((event) => {
      if (!eventCounts[event.eventName]) {
        eventCounts[event.eventName] = {
          eventName: event.eventName,
          totalRegistrations: 0,
          totalParticipants: 0,
          totalTeams: 0,
        };
        totalStats.totalEvents++;
      }
      eventCounts[event.eventName].totalRegistrations +=
        event.totalRegistrations;
      eventCounts[event.eventName].totalParticipants += event.totalParticipants;
      eventCounts[event.eventName].totalTeams += event.totalTeams;

      totalStats.totalRegistrations += event.totalRegistrations;
      totalStats.totalParticipants += event.totalParticipants;
      totalStats.totalTeams += event.totalTeams;
    });
  });
  return {
    events: Object.values(eventCounts),
    stats: totalStats,
  };
}

const StatCard = ({ title, value, icon, color, description }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Card
      sx={{
        p: isMobile ? 2 : 3,
        height: '100%',
        background: `linear-gradient(135deg, ${color}80 0%, ${color} 100%)`,
        boxShadow: `0 8px 16px ${color}40`,
        transition: 'transform 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
        },
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        spacing={2}
      >
        <Box>
          <Typography
            variant={isMobile ? 'subtitle1' : 'h6'}
            color="white"
            fontWeight="500"
          >
            {title}
          </Typography>
          <Typography
            variant={isMobile ? 'h5' : 'h4'}
            sx={{ mt: 1 }}
            color="white"
            fontWeight="bold"
          >
            {value}
          </Typography>
          <Typography
            variant="body2"
            color="white"
            sx={{ mt: 1, opacity: 0.8 }}
          >
            {description}
          </Typography>
        </Box>
        <Box
          sx={{
            p: 1.5,
            bgcolor: 'rgba(255, 255, 255, 0.2)',
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {React.cloneElement(icon, {
            sx: { color: 'white', fontSize: isMobile ? 24 : 32 },
          })}
        </Box>
      </Stack>
    </Card>
  );
};

const SocietyAnalyticsLayout = ({ data }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const columns = [
    {
      field: 'society',
      headerName: 'Society',
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        <Box sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>
          {params.value}
        </Box>
      ),
    },
    {
      field: 'totalRegistrations',
      headerName: 'Total Registrations',
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        <Box sx={{ color: theme.palette.primary.main, fontWeight: 'medium' }}>
          {params.value}
        </Box>
      ),
    },
    {
      field: 'totalParticipants',
      headerName: 'Total Participants',
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        <Box sx={{ color: theme.palette.success.main, fontWeight: 'medium' }}>
          {params.value}
        </Box>
      ),
    },
    {
      field: 'totalTeams',
      headerName: 'Total Teams',
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        <Box sx={{ color: theme.palette.warning.main, fontWeight: 'medium' }}>
          {params.value}
        </Box>
      ),
    },
  ];

  const eventColumns = [
    { field: 'eventName', headerName: 'Event Name', flex: 1, minWidth: 200 },
    {
      field: 'totalRegistrations',
      headerName: 'Registrations',
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        <Box sx={{ color: theme.palette.primary.main, fontWeight: 'medium' }}>
          {params.value}
        </Box>
      ),
    },
    {
      field: 'totalParticipants',
      headerName: 'Participants',
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        <Box sx={{ color: theme.palette.success.main, fontWeight: 'medium' }}>
          {params.value}
        </Box>
      ),
    },
    {
      field: 'totalTeams',
      headerName: 'Teams',
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        <Box sx={{ color: theme.palette.warning.main, fontWeight: 'medium' }}>
          {params.value}
        </Box>
      ),
    },
  ];

  const { events: eventDetails, stats } = aggregateEvents(data);

  const renderDetails = (params) => {
    const societyEvents = params.row.events;
    return (
      <Box sx={{ margin: 2 }}>
        <Typography
          variant="h6"
          gutterBottom
          sx={{ color: theme.palette.primary.main }}
        >
          Events of {params.row.society}
        </Typography>
        <DataGrid
          autoHeight
          columns={eventColumns}
          rows={societyEvents}
          pageSize={5}
          rowsPerPageOptions={[5]}
          hideFooterSelectedRowCount
          getRowId={(row) => `${row.eventName}_${params.row.society}`}
          sx={{
            '& .MuiDataGrid-cell:hover': {
              color: theme.palette.primary.main,
            },
            border: 'none',
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: theme.palette.background.neutral,
            },
          }}
        />
      </Box>
    );
  };

  return (
    <Box sx={{ width: '100%', mb: 5 }}>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Events"
            value={stats.totalEvents}
            icon={<EventIcon />}
            color="#FF4842"
            description="Total number of events across all societies"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Registrations"
            value={stats.totalRegistrations}
            icon={<HowToRegIcon />}
            color="#1890FF"
            description="Total number of approved registrations"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Participants"
            value={stats.totalParticipants}
            icon={<PeopleAltIcon />}
            color="#54D62C"
            description="Total number of unique participants"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Teams"
            value={stats.totalTeams}
            icon={<GroupsIcon />}
            color="#FFC107"
            description="Total number of registered teams"
          />
        </Grid>
      </Grid>

      <Card sx={{ mb: 4, boxShadow: theme.shadows[5] }}>
        <Box sx={{ p: isMobile ? 2 : 3 }}>
          <Typography variant="h5" gutterBottom color="text.primary">
            Society-wise Analytics
          </Typography>
          <DataGrid
            rows={data}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            getRowId={(row) => row.society}
            autoHeight
            components={{
              DetailPanel: renderDetails,
            }}
            sx={{
              border: 'none',
              '& .MuiDataGrid-cell:hover': {
                color: theme.palette.primary.main,
              },
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: theme.palette.background.neutral,
              },
            }}
          />
        </Box>
      </Card>

      <Card sx={{ boxShadow: theme.shadows[5] }}>
        <Box sx={{ p: isMobile ? 2 : 3 }}>
          <Typography variant="h5" gutterBottom color="text.primary">
            Event Summary
          </Typography>
          <DataGrid
            rows={eventDetails}
            columns={eventColumns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            autoHeight
            getRowId={(row) => row.eventName}
            sx={{
              border: 'none',
              '& .MuiDataGrid-cell:hover': {
                color: theme.palette.primary.main,
              },
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: theme.palette.background.neutral,
              },
            }}
          />
        </Box>
      </Card>
    </Box>
  );
};

export default SocietyAnalyticsLayout;
