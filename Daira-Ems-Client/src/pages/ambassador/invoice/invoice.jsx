import React, { useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Box, Container, Typography } from '@mui/material';
import { useRegistration } from '../../../service/registerationService';
import Spinner from '../../../utils/spinner';

function Invoice() {
  const { generateInvoice, loading, setLoading } = useRegistration();
  const userData = JSON.parse(localStorage.getItem('userData'));
  const useriD = userData.data.result._id;
  const token = userData.data.token;
  const [invoiceRow, setInvoiceRow] = useState([]);
  const [totalInvoiceRow, setTotalInvoiceRow] = useState([]);
  const [registrationTotal, setRegistrationTotal] = useState(0);
  const [accommodationTotal, setAccommodationTotal] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);

  useEffect(() => {
    const fetchInvoiceData = async () => {
      setLoading(true);
      const invoiceData = await generateInvoice(useriD, token);
      if (invoiceData) {
        setInvoiceRow(invoiceData.filteredRegistrationTableData);
        setTotalInvoiceRow(invoiceData.filteredAccommodationTableData);
        setRegistrationTotal(invoiceData.registrationTotal);
        setAccommodationTotal(invoiceData.accommodationTotal);
        setGrandTotal(invoiceData.grandTotal);
      }
      setLoading(false);
    };
    fetchInvoiceData();
  }, []);

  return (
    <>
      {loading ? (<Spinner />): (<><div> <Container>
        <Box sx={{ marginTop: '20px' }}>
          <Typography
            variant="h4"
            sx={{ fontWeight: 'bold', marginBottom: '10px', color: '#FFC107' }}
          >
            REGISTRATIONS
          </Typography>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead sx={{ color: 'white' }}>
                <TableRow
                  className="font-bold"
                  sx={{ backgroundColor: '#FFC107', color: 'white' }}
                >
                  <TableCell>Team Name</TableCell>
                  <TableCell align="right">Participants Count</TableCell>
                  <TableCell align="right">Fee</TableCell>
                  <TableCell align="right">Event Name</TableCell>
                  <TableCell align="right">Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {invoiceRow.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell component="th" scope="row">
                      {row.teamName}
                    </TableCell>
                    <TableCell align="right">{row.participantsCount}</TableCell>
                    <TableCell align="right">{row.fee}</TableCell>
                    <TableCell align="right">{row.eventName}</TableCell>
                    <TableCell align="right">{row.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        {/* Second invoice */}
        <Box
          sx={{
            textAlign: 'right',
            paddingTop: '10px',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '10px 0',
              borderBottom: '1px solid #E0E0E0',
              textAlign: 'right',
            }}
          >
            <Typography
              sx={{
                fontWeight: 'bold',
                fontSize: '20px',
              }}
            >
              Registrations Total:
            </Typography>
            <span className="text-[#5D6481]">PKR {registrationTotal}</span>
          </Box>
        </Box>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 'bold',
            marginBottom: '10px',
            color: '#FFC107',
            marginTop: '20px',
          }}
        >
          ACCOMMODATION
        </Typography>
        <Box sx={{ marginTop: '20px' }}>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead sx={{ color: 'white' }}>
                <TableRow
                  className="font-bold"
                  sx={{ backgroundColor: '#FFC107', color: 'white' }}
                >
                  <TableCell>Participant Name</TableCell>
                  <TableCell align="right">Number of Teams</TableCell>
                  <TableCell align="right">Gender</TableCell>
                  <TableCell align="right">Fee</TableCell>
                  <TableCell align="right">Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {totalInvoiceRow.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell component="th" scope="row">
                      {row.participantName}
                    </TableCell>
                    <TableCell align="right">{row.numberOfTeams}</TableCell>
                    <TableCell align="right">{row.gender}</TableCell>
                    <TableCell align="right">{row.fee}</TableCell>
                    <TableCell align="right">{row.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '10px 0',
              borderBottom: '1px solid #E0E0E0',
              textAlign: 'right',
            }}
          >
            <Typography
              sx={{
                fontWeight: 'bold',
                fontSize: '20px',
              }}
            >
              Accomdation Total:
            </Typography>
            <span className="text-[#5D6481]">PKR {accommodationTotal}</span>
          </Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '10px 0',
              borderBottom: '1px solid #E0E0E0',
              textAlign: 'right',
            }}
          >
            <Typography
              sx={{
                fontWeight: 'bold',
                fontSize: '20px',
                color: 'BLACK',
              }}
            >
              Grand Total:
            </Typography>
            <span className="text-1xl font-bold  text-[#FFC107]">
              PKR {grandTotal}
            </span>
          </Box>
        </Box>
      </Container>
    </div></>) }
    </>
     
  );
}

export default Invoice;
