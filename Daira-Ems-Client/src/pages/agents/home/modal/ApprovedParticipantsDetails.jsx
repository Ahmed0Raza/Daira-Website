import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Container,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { useRegistrationAgent } from '../../../../service/registrationAgentService';
import ParticipantHeaderField from '../header/ParticipantHeaderField';

const ApprovedParticipantDetails = ({ token }) => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchCriteria, setSearchCriteria] = useState({ name: '', cnic: '' });
  const { getApprovedParticipantDetails } = useRegistrationAgent();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await getApprovedParticipantDetails(token);
        if (result) {
          setData(result);
          setFilteredData(result);
        }
      } catch (error) {
        console.error('Error fetching approved participant details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  useEffect(() => {
    if (!searchCriteria.name && !searchCriteria.cnic) {
      setFilteredData(data);
    } else {
      const filtered = data.filter((participant) => {
        const matchesName = searchCriteria.name
          ? participant.name.toLowerCase().includes(searchCriteria.name)
          : true;
        const matchesCnic = searchCriteria.cnic
          ? participant.cnic.toLowerCase().includes(searchCriteria.cnic)
          : true;
        return matchesName && matchesCnic;
      });
      setFilteredData(filtered);
    }
  }, [searchCriteria, data]);

  const colorScheme = {
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
          Approved Participants Details
        </Typography>

        <ParticipantHeaderField setSearch={setSearchCriteria} />

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress sx={{ color: '#ffc107' }} />
          </Box>
        ) : filteredData.length === 0 ? (
          <Typography
            variant="h6"
            sx={{ textAlign: 'center', color: '#666', p: 4 }}
          >
            No approved participants found.
          </Typography>
        ) : (
          <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
            <Table>
              <TableHead sx={{ backgroundColor: colorScheme.headerBg }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', color: colorScheme.headerText }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: colorScheme.headerText }}>CNIC</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: colorScheme.headerText }}>Contact Number</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: colorScheme.headerText }}>Gender</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: colorScheme.headerText }}>Team Names</TableCell>
                </TableRow>
              </TableHead>
              <TableBody sx={{ backgroundColor: colorScheme.bodyBg }}>
                {filteredData.map((participant, index) => (
                  <TableRow 
                    key={index}
                    sx={{ backgroundColor: colorScheme.bodyBg }}
                  >
                    <TableCell>{participant.name}</TableCell>
                    <TableCell>{participant.cnic}</TableCell>
                    <TableCell>{participant.contactNumber}</TableCell>
                    <TableCell>{participant.gender}</TableCell>
                    <TableCell>
                      {(participant.teams && participant.teams.length > 0)
                        ? participant.teams.join(', ')
                        : 'N/A'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Container>
  );
};

export default ApprovedParticipantDetails;
