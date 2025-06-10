import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import EventDetails from '../register/eventDetails';
import EditParticipants from './EditParticipants';

const EditRegisteration = ({ data }) => {
  const [teamName, setTeamName] = useState('');
  const [dropdownValues, setDropdownValues] = useState('');
  const handleDropdownChange = async (field, value) => {
    setDropdownValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  const [invoiceRow, setInvoiceRow] = useState([
    {
      minTeamSize: 'NULL',
      maxTeamSize: 'NULL',
      headName: 'NULL',
      contactNumber: 'NULL',
      registrationFee: 'NULL',
      status: 'NULL',
      prizeMoney: 'NULL',
    },
  ]);
  useEffect(() => {
    console.log(data);
  }, []);
  return (
    <>
      <Box
        sx={{
          display: 'flex',
          backgroundColor: '#ebecef',
          minHeight: '100%',
          width: '100%',
          padding: 2,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            gap: 2,
            backgroundColor: 'white',
            padding: 3,
            borderRadius: 1,
            p: 3,
            boxShadow: 10,
          }}
        >
          <EventDetails name={data} invoiceRow={setInvoiceRow} />
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow
                  className="font-bold"
                  sx={{ backgroundColor: '#fc8b00', color: 'white' }}
                >
                  <TableCell>Min Participants</TableCell>
                  <TableCell align="right">Max Participants</TableCell>
                  <TableCell align="right">Event Head</TableCell>
                  <TableCell align="right">Contact</TableCell>
                  <TableCell align="right">Reg Fee</TableCell>
                  <TableCell align="right">Reg Type</TableCell>
                  <TableCell align="right">Winning</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {invoiceRow.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell component="th" scope="row">
                      {row.minTeamSize}
                    </TableCell>
                    <TableCell align="right">{row.maxTeamSize}</TableCell>
                    <TableCell align="right">{row.headName}</TableCell>
                    <TableCell align="right">{row.contactNumber}</TableCell>
                    <TableCell align="right">{row.registrationFee}</TableCell>
                    <TableCell align="right">{row.status}</TableCell>
                    <TableCell align="right">{row.prizeMoney}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <EditParticipants
            maxParticipants={invoiceRow[0].maxTeamSize}
            minParticipants={invoiceRow[0].minTeamSize}
            setTeamName={setTeamName}
            teamName={teamName}
            fee={invoiceRow[0].registrationFee}
            status={invoiceRow[0].status}
            dropdownValues={dropdownValues}
          />
        </Box>
      </Box>
    </>
  );
};

export default EditRegisteration;
