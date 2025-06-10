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

const UnapprovedAccommodationDetails = ({ token }) => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getUnapprovedAccommodationDetails } = useRegistrationAgent();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await getUnapprovedAccommodationDetails(token);
        if (result) {
          setData(result);
          setFilteredData(result);
        }
      } catch (error) {
        console.error('Error fetching unapproved accommodation details:', error);
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

  const unapprovedColors = {
    headerBg: '#ffcdd2',
    bodyBg: '#ffebee',
    headerText: '#000',
  };

  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={0} sx={{ p: 3, borderRadius: 2, boxShadow: 'none' }}>
        <Typography
          variant="h4"
          sx={{ textAlign: 'center', mb: 3, fontWeight: 'bold', color: '#f44336' }}
        >
          Unapproved Accommodation Details
        </Typography>

        <HeaderFields setSearch={handleSearch} />

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress sx={{ color: '#f44336' }} />
          </Box>
        ) : filteredData.length === 0 ? (
          <Typography variant="h6" sx={{ textAlign: 'center', color: '#666', p: 4 }}>
            No unapproved accommodations found.
          </Typography>
        ) : (
          <AccommodationTable data={filteredData} colorScheme={unapprovedColors} />
        )}
      </Paper>
    </Container>
  );
};

export default UnapprovedAccommodationDetails;
