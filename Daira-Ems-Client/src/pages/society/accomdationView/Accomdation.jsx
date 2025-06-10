import { useEffect, useState } from 'react';
import { useSociety } from '../../../service/societyService';
import {
  Box,
  Card,
  Container,
  Grid,
  Typography,
  useTheme,
  useMediaQuery,
  Stack,
  Avatar,
  Chip,
  Paper,
  Divider,
  Tooltip,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';
import HotelIcon from '@mui/icons-material/Hotel';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import EventIcon from '@mui/icons-material/Event';
import Spinner from '../../../utils/spinner';

const Accomdation = () => {
  const { getAccomodationCount } = useSociety();
  const [accomodationData, setAccomodationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const columns = [
    {
      field: 'id',
      headerName: 'ID',
      flex: 0.5,
      minWidth: 100,
      hide: true,
    },
    {
      field: 'name',
      headerName: 'Name',
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar sx={{ bgcolor: theme.palette.primary.light }}>
            {params.value.charAt(0)}
          </Avatar>
          <Typography>{params.value}</Typography>
        </Stack>
      ),
    },
    {
      field: 'gender',
      headerName: 'Gender',
      flex: 0.5,
      minWidth: 120,
      renderCell: (params) => (
        <Chip
          icon={params.value === 'Male' ? <MaleIcon /> : <FemaleIcon />}
          label={params.value}
          color={params.value === 'Male' ? 'primary' : 'secondary'}
          variant="outlined"
        />
      ),
    },
    {
      field: 'society',
      headerName: 'Society',
      flex: 1,
      minWidth: 180,
    },
    {
      field: 'contactNumber',
      headerName: 'Contact',
      flex: 0.8,
      minWidth: 150,
    },
    {
      field: 'events',
      headerName: 'Events',
      flex: 1.5,
      minWidth: 250,
      renderCell: (params) => (
        <Tooltip title={params.value.join(', ')} placement="top" arrow>
          <Stack direction="row" spacing={1} alignItems="center">
            <EventIcon sx={{ color: theme.palette.primary.main }} />
            <Typography variant="body2" noWrap>
              {params.value.length} Events
            </Typography>
          </Stack>
        </Tooltip>
      ),
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem('isSocietyData'));
        const token = userData.result;
        const response = await getAccomodationCount(token);
        if (response.success) {
          const participantsWithIds = response.data.participants.map(
            (participant, index) => ({
              ...participant,
              id: `${participant.name}-${participant.contactNumber}-${index}`,
            })
          );
          setAccomodationData({
            ...response.data,
            participants: participantsWithIds,
          });
        }
      } catch (error) {
        console.error('Error fetching accommodation data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <Spinner />
      </Box>
    );
  }

  const genderCounts =
    accomodationData?.analysis?.genderDistribution?.counts || {};
  const totalParticipants =
    accomodationData?.analysis?.totalAccommodations || 0;
  const societyCounts =
    accomodationData?.analysis?.societyDistribution?.counts || {};

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: isMobile ? 2 : 4 }}>
        <Card
          sx={{
            mb: 4,
            p: isMobile ? 2 : 3,
            background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
            color: 'white',
          }}
        >
          <Stack direction="row" spacing={2} alignItems="center" mb={2}>
            <HotelIcon sx={{ fontSize: 40, color: 'white' }} />
            <Typography
              variant={isMobile ? 'h5' : 'h4'}
              sx={{ color: 'white', fontWeight: 'bold' }}
            >
              Accommodation Dashboard
            </Typography>
          </Stack>
          <Typography variant="body1" sx={{ color: 'white', opacity: 0.9 }}>
            Comprehensive overview of accommodation requirements and participant
            details
          </Typography>
        </Card>

        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} sm={6} md={3}>
            <Paper
              sx={{
                p: 3,
                textAlign: 'center',
                height: '100%',
                background: theme.palette.background.paper,
                boxShadow: theme.shadows[2],
                '&:hover': {
                  boxShadow: theme.shadows[4],
                },
              }}
            >
              <PeopleAltIcon
                sx={{ fontSize: 40, color: theme.palette.primary.main, mb: 1 }}
              />
              <Typography variant="h4" gutterBottom color="text.primary">
                {totalParticipants}
              </Typography>
              <Typography variant="subtitle1" color="text.primary">
                Total Participants
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Paper
              sx={{
                p: 3,
                textAlign: 'center',
                height: '100%',
                background: theme.palette.background.paper,
                boxShadow: theme.shadows[2],
                '&:hover': {
                  boxShadow: theme.shadows[4],
                },
              }}
            >
              <HotelIcon
                sx={{ fontSize: 40, color: theme.palette.success.main, mb: 1 }}
              />
              <Typography variant="h4" gutterBottom color="text.primary">
                {Math.ceil(totalParticipants / 3)}
              </Typography>
              <Typography variant="subtitle1" color="text.primary">
                Rooms Required
              </Typography>
            </Paper>
          </Grid>
        </Grid>
        <Card>
          <Box sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom color="text.primary">
              Participant Details
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <DataGrid
              rows={accomodationData?.participants || []}
              columns={columns}
              autoHeight
              pageSize={5}
              rowsPerPageOptions={[5, 10, 20]}
              disableSelectionOnClick
              sx={{
                border: 'none',
                '& .MuiDataGrid-cell': {
                  color: theme.palette.text.primary,
                },
                '& .MuiDataGrid-cell:hover': {
                  color: theme.palette.primary.main,
                },
                '& .MuiDataGrid-columnHeaders': {
                  backgroundColor: theme.palette.background.neutral,
                  color: theme.palette.text.primary,
                },
                '& .MuiDataGrid-footerContainer': {
                  backgroundColor: theme.palette.background.neutral,
                },
              }}
            />
          </Box>
        </Card>
      </Box>
    </Container>
  );
};

export default Accomdation;
