import React, { useEffect, useState, useCallback, memo } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import SelectEvent from './selectEvent';
import EventDetails from './eventDetails';
import AddParticipants from './addParticipants';
import Spinner from '../../../utils/spinner';

// Initial state constants
const INITIAL_INVOICE_ROW = {
  minTeamSize: 'NULL',
  maxTeamSize: 'NULL',
  headName: 'NULL',
  contactNumber: 'NULL',
  registrationFee: 'NULL',
  status: 'NULL',
  prizeMoney: 'NULL',
  registrationType: 'NULL',
};

// Memoized table header for performance
const TableHeader = memo(() => (
  <TableHead>
    <TableRow sx={{ backgroundColor: '#FFC107' }}>
      <TableCell>Min Participants</TableCell>
      <TableCell align="right">Max Participants</TableCell>
      <TableCell align="right">Event Head</TableCell>
      <TableCell align="right">Contact</TableCell>
      <TableCell align="right">Reg Fee</TableCell>
      <TableCell align="right">Reg Type</TableCell>
      <TableCell align="right">Winning</TableCell>
    </TableRow>
  </TableHead>
));

TableHeader.displayName = 'TableHeader';

// Memoized event details table
const EventDetailsTable = memo(({ invoiceRow }) => (
  <TableContainer
    component={Paper}
    sx={{
      width: '100%',
      overflowX: {
        xs: 'auto',
        sm: 'visible',
      },
      overflowY: 'visible',
    }}
  >
    <Table
      sx={{
        minWidth: 650,
        tableLayout: 'auto',
      }}
      aria-label="event details table"
    >
      <TableHeader />
      <TableBody>
        {invoiceRow.map((row, index) => (
          <TableRow key={index}>
            <TableCell>{row.minTeamSize}</TableCell>
            <TableCell align="right">{row.maxTeamSize}</TableCell>
            <TableCell align="right">{row.headName}</TableCell>
            <TableCell align="right">{row.contactNumber}</TableCell>
            <TableCell align="right">{row.registrationFee}</TableCell>
            <TableCell align="right">{row.registrationType}</TableCell>
            <TableCell align="right">{row.prizeMoney}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
));

EventDetailsTable.displayName = 'EventDetailsTable';

const Register = () => {
  const [teamName, setTeamName] = useState('');
  const [dropdownValues, setDropdownValues] = useState({});
  const [invoiceRow, setInvoiceRow] = useState([INITIAL_INVOICE_ROW]);
  const [isLoading, setIsLoading] = useState(false);

  const handleDropdownChange = useCallback((field, value) => {
    setDropdownValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        const name = dropdownValues.event;

        if (!name) return;

        const eventData = await getEventDetails(token, name);

        if (eventData) {
          setInvoiceRow([
            {
              minTeamSize: eventData.minTeamSize,
              maxTeamSize: eventData.maxTeamSize,
              headName: eventData.headName,
              contactNumber: eventData.nuEmailAddress,
              registrationFee: eventData.registrationFee,
              registrationType: eventData.registrationType,
              status: eventData.status,
              prizeMoney: eventData.prizeMoney,
            },
          ]);
        }
      } catch (error) {
        console.error('Error fetching event details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEventDetails();
  }, [dropdownValues.event]);

  const currentInvoiceRow = invoiceRow[0];
  const isEventReady = dropdownValues.event && dropdownValues.category;

  return (
    <Box
      sx={{
        width: '100%',
        backgroundColor: 'white',
        p: 2,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          gap: 2,
          backgroundColor: 'white',
          p: 3,
          borderRadius: 1,
        }}
      >
        <SelectEvent onChange={handleDropdownChange} values={dropdownValues} />

        {isLoading ? (
          <Spinner />
        ) : (
          <>
            {dropdownValues.event && (
              <>
                <EventDetails
                  name={dropdownValues.event}
                  invoiceRow={setInvoiceRow}
                />

                <EventDetailsTable invoiceRow={invoiceRow} />
              </>
            )}

            {isEventReady && (
              <AddParticipants
                maxParticipants={currentInvoiceRow.maxTeamSize}
                minParticipants={currentInvoiceRow.minTeamSize}
                setTeamName={setTeamName}
                teamName={teamName}
                fee={currentInvoiceRow.registrationFee}
                status={currentInvoiceRow.status}
                dropdownValues={dropdownValues}
                setDropdownValues={setDropdownValues}
                setInvoiceRow={setInvoiceRow}
                registrationType={currentInvoiceRow.registrationType}
              />
            )}
          </>
        )}
      </Box>
    </Box>
  );
};

export default Register;
