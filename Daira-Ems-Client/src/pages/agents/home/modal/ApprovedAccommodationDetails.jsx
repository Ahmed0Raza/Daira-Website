import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Container,
  CircularProgress,
} from '@mui/material';
import { useRegistrationAgent } from '../../../../service/registrationAgentService';
import AccommodationTable from './AccomodationTable';
import HeaderFields from '../header/headerFields';

const ApprovedAccommodationDetails = ({ token }) => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getApprovedAccommodationDetails } = useRegistrationAgent();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await getApprovedAccommodationDetails(token);
        if (result) {
          setData(result);
          setFilteredData(result);
        }
      } catch (error) {
        console.error('Error fetching approved accommodation details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const handleSearch = (searchTerm) => {
    if (!searchTerm) {
      setFilteredData(data);
    } else {
      const filtered = data.filter((participant) =>
        participant.teamNames.some((team) =>
          team.toLowerCase().includes(searchTerm)
        )
      );
      setFilteredData(filtered);
    }
  };

  const approvedColors = {
    headerBg: '#ffc107',
    bodyBg: '#fffde7',
    headerText: '#000',
  };

  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={0} sx={{ p: 3, borderRadius: 2, boxShadow: 'none' }}>
        <Typography
          variant="h4"
          sx={{ textAlign: 'center', mb: 3, fontWeight: 'bold', color: '#ffc107' }}
        >
          Approved Accommodation Details
        </Typography>

        <HeaderFields setSearch={handleSearch} />

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress sx={{ color: '#ffc107' }} />
          </Box>
        ) : filteredData.length === 0 ? (
          <Typography variant="h6" sx={{ textAlign: 'center', color: '#666', p: 4 }}>
            No approved accommodations found.
          </Typography>
        ) : (
          <AccommodationTable data={filteredData} colorScheme={approvedColors} />
        )}
      </Paper>
    </Container>
  );
};

export default ApprovedAccommodationDetails;
