import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  useTheme,
  useMediaQuery,
  Container,
  Card,
  Grid,
  Stack,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import EventTeamsDataGrid from './view/table';
import { useSociety } from '../../../service/societyService';
import Spinner from '../../../utils/spinner';

const ParticipantView = () => {
  const [data, setData] = useState([]);
  const { getParticipantsEventWise, loading, getparticipantsDetails } =
    useSociety();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const fetchData = async () => {
      const userData = JSON.parse(localStorage.getItem('isSocietyData'));
      const token = userData.result;
      try {
        const response = await getParticipantsEventWise(token);
        setData(response);
      } catch (error) {
        console.error('Error fetching participant data:', error);
      }
    };
    fetchData();
  }, []);

  const handleDownload = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('isSocietyData'));
      const token = userData.result;
      const res = await getparticipantsDetails(token);

      if (res) {
        const blob = new Blob([res], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'participants-details.csv';
        link.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error downloading data:', error);
    }
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: isMobile ? 2 : 4 }}>
        {loading ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '60vh',
            }}
          >
            <Spinner />
          </Box>
        ) : (
          <>
            <Card
              sx={{
                mb: 4,
                p: isMobile ? 2 : 3,
                background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
                boxShadow: theme.shadows[10],
              }}
            >
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={8}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <AnalyticsIcon
                      sx={{ color: 'white', fontSize: isMobile ? 30 : 40 }}
                    />
                    <Typography
                      variant={isMobile ? 'h5' : 'h4'}
                      component="h1"
                      sx={{
                        color: 'white',
                        fontWeight: 'bold',
                      }}
                    >
                      Society Analytics Dashboard
                    </Typography>
                  </Stack>
                  <Typography
                    variant="body1"
                    sx={{
                      mt: 1,
                      color: 'rgba(255, 255, 255, 0.8)',
                    }}
                  >
                    Comprehensive view of participant data across all events
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs={12}
                  md={4}
                  sx={{
                    display: 'flex',
                    justifyContent: { xs: 'flex-start', md: 'flex-end' },
                  }}
                >
                  <Button
                    variant="contained"
                    onClick={handleDownload}
                    startIcon={<DownloadIcon />}
                    sx={{
                      bgcolor: 'white',
                      color: theme.palette.primary.main,
                      '&:hover': {
                        bgcolor: 'rgba(255, 255, 255, 0.9)',
                      },
                      px: 3,
                      py: 1.5,
                    }}
                  >
                    Export Data
                  </Button>
                </Grid>
              </Grid>
            </Card>

            <Card
              sx={{
                boxShadow: theme.shadows[5],
                borderRadius: 2,
                overflow: 'hidden',
              }}
            >
              <EventTeamsDataGrid eventsData={data} />
            </Card>
          </>
        )}
      </Box>
    </Container>
  );
};

export default ParticipantView;
