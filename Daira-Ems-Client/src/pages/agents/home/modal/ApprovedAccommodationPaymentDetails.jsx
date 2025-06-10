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
import HeaderFields from '../header/headerFields';

const ApprovedAccommodationPaymentDetails = ({ token }) => {
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

  // Table headers including the new Payment Details column
  const headers = ['Participant Name', 'CNIC', 'Contact Number', 'Team Names', 'Payment Details'];

  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={0} sx={{ p: 3, borderRadius: 2, boxShadow: 'none' }}>
        <Typography
          variant="h4"
          sx={{ textAlign: 'center', mb: 3, fontWeight: 'bold', color: '#ffc107' }}
        >
          Approved Accommodation Payment Details
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
          <TableContainer
            component={Paper}
            sx={{
              boxShadow: 'none',
              border: 'none',
              backgroundColor: approvedColors.bodyBg,
            }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  {headers.map((heading, idx) => (
                    <TableCell
                      key={idx}
                      sx={{
                        fontWeight: 'bold',
                        backgroundColor: approvedColors.headerBg,
                        color: approvedColors.headerText || '#000',
                        border: 'none',
                        fontSize: '15px',
                      }}
                    >
                      {heading}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData.map(({ participantName, cnic, contactNumber, teamNames, fee }, index) => (
                  <TableRow key={index}>
                    <TableCell sx={{ border: 'none', fontSize: '15px' }}>{participantName}</TableCell>
                    <TableCell sx={{ border: 'none', fontSize: '15px' }}>{cnic}</TableCell>
                    <TableCell sx={{ border: 'none', fontSize: '15px' }}>{contactNumber}</TableCell>
                    <TableCell sx={{ border: 'none', fontSize: '15px' }}>
                      {teamNames.length > 0 ? teamNames.join(', ') : 'Unknown'}
                    </TableCell>
                    <TableCell sx={{ border: 'none', fontSize: '15px' }}>
                      {fee ? `PKR ${fee}` : 'N/A'}
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

export default ApprovedAccommodationPaymentDetails;