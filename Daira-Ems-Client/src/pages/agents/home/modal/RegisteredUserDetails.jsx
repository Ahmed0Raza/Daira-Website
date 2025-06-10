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
import UserHeaderField from '../header/UserHeaderField';

const RegisteredUserDetails = ({ token }) => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getRegisteredUsers } = useRegistrationAgent();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await getRegisteredUsers(token);
        if (result) {
          setData(result);
          setFilteredData(result);
        }
      } catch (error) {
        console.error('Error fetching registered users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  // Filter the data based on the search term provided by the header field
  const handleSearch = (searchTerm) => {
    if (!searchTerm) {
      setFilteredData(data);
    } else {
      const filtered = data.filter((user) =>
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredData(filtered);
    }
  };

  const colorScheme = {
    headerBg: '#ffc107',
    bodyBg: '#fffde7',
    headerText: '#000',
  };

  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      <Paper 
        elevation={0} 
        sx={{ 
          p: 3, 
          borderRadius: 2, 
          boxShadow: 'none'
        }}
      >
        <Typography
          variant="h4"
          sx={{ textAlign: 'center', mb: 3, fontWeight: 'bold', color: '#ffc107' }}
        >
          Registered Users Details
        </Typography>

        <UserHeaderField setSearch={handleSearch} />

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress sx={{ color: '#ffc107' }} />
          </Box>
        ) : filteredData.length === 0 ? (
          <Typography variant="h6" sx={{ textAlign: 'center', color: '#666', p: 4 }}>
            No registered users found.
          </Typography>
        ) : (
          <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
            <Table>
              <TableHead sx={{ backgroundColor: colorScheme.headerBg }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', color: colorScheme.headerText }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: colorScheme.headerText }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: colorScheme.headerText }}>CNIC</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: colorScheme.headerText }}>Contact</TableCell>
                </TableRow>
              </TableHead>
              <TableBody sx={{ backgroundColor: colorScheme.bodyBg }}>
                {filteredData.map((user, index) => (
                  <TableRow 
                    key={index}
                    sx={{ backgroundColor: colorScheme.bodyBg }}
                  >
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.cnic}</TableCell>
                    <TableCell>{user.contact}</TableCell>
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

export default RegisteredUserDetails;